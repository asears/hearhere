# Snowflake Summit 2025 Hands-on Labs

## dbt Labs + Snowflake Pipeline Lab

### Overview
Build a data pipeline using Snowflake and dbt to analyze trading P&L across multiple currencies, normalize trade data using FX rates, and compare actual performance against portfolio targets.

### Key Features
- Integration with Snowflake Marketplace data
- FX rates and US equity price history analysis  
- Trading history and target allocation ratio processing
- LLM integration for pattern/sentiment extraction from trader notes

### Setup Steps
1. Create dbt Cloud account: https://cloud.getdbt.com/coalesce-workshop-signup/?id=20
2. Access the QuickStart guide: https://quickstarts.snowflake.com/guide/data_engineering_deploying_pipelines_with_snowflake_and_dbt_labs/
3. Configure source data connections

### Lab Resources
- ANALYTICS.SNOWFLAKE_SUMMIT_HOL_RAW.WEIGHTS_TABLE
- ANALYTICS.SNOWFLAKE_SUMMIT_HOL_RAW.TRADING_BOOKS
- STOCK_TRACKING_US_STOCK_PRICES_BY_DAY.STOCK.US_STOCK_METRICS
- FOREX_TRACKING_CURRENCY_EXCHANGE_RATES_BY_DAY.STOCK.FOREX_METRICS

## Infostrux Data Science Lab

### Overview
Hands-on lab focused on Snowflake integration with Python for data analysis and visualization.

### Prerequisites
- Snowflake account with appropriate permissions
- Python 3.11.9
- Access to GitHub repository: https://github.com/Infostrux-Solutions/hol-notebook

### Required Python Modules
- streamlit
- pandas  
- scikit-learn
- rdkit
- snowflake-snowpark-python

### Lab Content
1. Demo 1:
   - Python package imports and setup
   - Snowpark for data analysis
   - SQL data generation
   - Pandas DataFrame operations
   - Streamlit visualizations

2. Demo 2: 
   - Advanced data analysis examples
   - Additional visualization techniques

### Setup Resources
- Setup SQL scripts for Snowflake environment
- Database and warehouse configuration
- Role and permission management
- API and external access integration

### Documentation Links
- [Snowflake Documentation](https://docs.snowflake.com/)
- [Streamlit Documentation](https://docs.streamlit.io/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [scikit-learn Documentation](https://scikit-learn.org/stable/documentation.html)
- [RDKit Documentation](https://www.rdkit.org/docs/)
