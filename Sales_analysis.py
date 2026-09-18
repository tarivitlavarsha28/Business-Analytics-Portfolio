import pandas as pd
import matplotlib.pyplot as plt

# Sample sales data
data = {
    "Product": ["Laptop", "Mobile", "Tablet", "Laptop", "Mobile",
                "Tablet", "Laptop", "Mobile", "Tablet", "Laptop"],
    "Region": ["North", "South", "East", "West", "North",
               "South", "East", "West", "North", "South"],
    "Sales": [75000, 45000, 30000, 82000, 50000,
              35000, 90000, 48000, 32000, 78000]
}

df = pd.DataFrame(data)

# Display the data
print("Sales Data:")
print(df)

# Total sales
total_sales = df["Sales"].sum()
print("\nTotal Sales:", total_sales)

# Sales by product
product_sales = df.groupby("Product")["Sales"].sum()
print("\nSales by Product:")
print(product_sales)

# Sales by region
region_sales = df.groupby("Region")["Sales"].sum()
print("\nSales by Region:")
print(region_sales)

# Visualization
product_sales.plot(kind="bar")
plt.title("Sales by Product")
plt.xlabel("Product")
plt.ylabel("Sales")
plt.tight_layout()
plt.show()
