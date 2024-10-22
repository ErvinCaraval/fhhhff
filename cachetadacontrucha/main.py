from fastapi import FastAPI

app = FastAPI()

@app.get("/todo")
def read_todo():
    return {
        "papas": ["Papas fritas", "Papas a la francesa", "Papas bravas"],
        "salchichas": ["Salchicha vienesa", "Salchicha parrillera", "Salchicha alemana"],
        "salsas": ["Salsa BBQ", "Salsa de tomate", "Salsa de ajo", "Salsa tártara", "Salsa picante"]


    }

