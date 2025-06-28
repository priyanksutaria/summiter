import pandas as pd
import sqlite3

# 1. Load the Excel
df = pd.read_excel("peaks.xlsx")

# 2. Keep only the columns you need (and rename if necessary)
df = df.rename(columns={
    "ID":       "id",
   "Name(Transformation to normalise it)": "name",
    "Latitude": "latitude",
    "Longitude": "longitude",
    "Elevation (ft)": "elevation",
    "State": "state"
})[["id","name","latitude","longitude","elevation","state"]]

# 3. Write to SQLite
conn = sqlite3.connect("peaks.db")
df.to_sql("peaks", conn, if_exists="replace", index=False)
# 4. (Optional) speed it up later:
conn.execute("CREATE INDEX IF NOT EXISTS idx_lat_lon ON peaks(latitude, longitude);")
conn.close()
