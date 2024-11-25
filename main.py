from pymongo import MongoClient

from datetime import datetime
import random
import time

client = MongoClient("")

db = client['test']

collection = db['test']





while True:
    # Create the current timestamp
    timestamp = datetime.utcnow()  # Use UTC time for consistency, can use `datetime.now()` for local time

    data = {
        "timestamp": timestamp,  # Add the timestamp field
        "humidite_sol": random.uniform(20, 100) + random.uniform(-5, 5),  # More realistic soil humidity
        "temperature_sol": random.uniform(5, 35),  # Simulated soil temperature
        "humidite_air": random.uniform(40, 80) + random.uniform(-5, 5),  # Simulated air humidity
        "temperature_air": random.uniform(-10, 35),  # Simulated air temperature
        "lumiere": random.uniform(0, 100_000) * (0.5 + random.uniform(-0.1, 0.1)),  # Light intensity with fluctuations
        "pH_sol": random.uniform(5.5, 7.5),  # Simulated soil pH
        "niveau_nutrimets": {
            "nitrogen": random.uniform(10, 50),   # Nitrogen (ppm)
            "phosphorus": random.uniform(5, 30),  # Phosphorus (ppm)
            "potassium": random.uniform(100, 300) # Potassium (ppm)
        }
    }

    # Insert the data into MongoDB
    result = collection.insert_one(data)
    print(result)

    # Sleep to simulate sensor reporting interval
    time.sleep(2)

