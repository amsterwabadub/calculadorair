import os
import csv
import json

base_dir = "/Users/at/Desktop/Second Brain/Projects/orgproject/Brazil"
research_dir = os.path.join(base_dir, "research")
portfolio_dir = os.path.join(base_dir, "portfolio")
os.makedirs(research_dir, exist_ok=True)
os.makedirs(portfolio_dir, exist_ok=True)

print("Starting Wave 1 Data Generation Script...")
