import json
import pandas as pd

# Load the JSON file
with open("/Users/jinseokim/github/CIS-4500_League_Simulator/client/public/riot_champion.json", "r") as file:
    data = json.load(file)

# Extract 'id' and 'key' from each dictionary
extracted_data = [{"id": champ["id"], "key": champ["key"]} for champ in data]

# Create a DataFrame
df = pd.DataFrame(extracted_data) 

# Save the DataFrame to a CSV file
df.to_csv("champion_ids_keys.csv", index=False)
