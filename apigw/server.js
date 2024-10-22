
const { ApolloServer, AuthenticationError } = require('apollo-server');
const axios = require('axios');

const typeDefs = `
  type Query {
    service1: [String]
    service2: String
    service3: String
    service4: [String]
    
  }
`;

const resolvers = {
  Query: {
    service1: async () => {
      try {
        const response = await axios.get('http://salchipapitas:5000/comestibles');
        return [...response.data.papas, ...response.data.salchichas];
      } catch (err) {
        console.error('Error al obtener datos de Salchipapitas:', err);
        return [];
      }
    },
    service2: async () => {
      try {
        const response = await axios.get('http://besoscerezas:8080/besos');
        let result = 'Besos sabor cereza: ';
        for (const [key, value] of Object.entries(response.data)) {
          result += `Beso ${key} -> ${value}, `;
        }
        return result.slice(0, -2); // Eliminar última coma
      } catch (err) {
        console.error('Error al obtener datos de Besoscerezas:', err);
        return 'Error al obtener datos de Besoscerezas';
      }
    },
    service3: async () => {
      return "Hola, soy servicio3 Cachetada con Trucha!";
    },
    service4: async () => {
      try {
        const response = await axios.get('http://cachetadacontrucha:6000/todo');
        return [...response.data.papas, ...response.data.salchichas, ...response.data.salsas];
      } catch (err) {
        console.error('Error al obtener datos de cachetada:', err);
        return [];
      }
    },
  },
};

async function getContext({ req }) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.split('Bearer ')[1];

  try {
    const response = await axios.post('http://authservice:3000/verify-token', { token });
    if (response.data && response.data.isValid) {
      return { token };
    } else {
      throw new AuthenticationError('No autorizado');
    }
  } catch (err) {
    throw new AuthenticationError('Error al validar el token');
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: getContext,
});

server.listen().then(({ url }) => {
  console.log(`API Gateway listo en ${url}`);
});

