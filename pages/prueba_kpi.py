# -*- coding: utf-8 -*-
"""
Created on Tue Aug 15 21:54:24 2023

@author: arsan
"""

import streamlit as st
import requests
import seaborn as sns
import pandas as pd
import warnings
import matplotlib.pyplot as plt
from io import StringIO
import plotly.express as px
from datetime import datetime, timedelta


data = pd.read_csv('./eda/data/cammesa/maximos_historicos.csv')

st.set_page_config(
    page_title="Inicio",
    page_icon="🏠",
    layout="wide",
)

st.title('Más KPIs')

col_1, col_2, col_3 = st.columns(3)

with col_1:
    st.write('sarasa')
with col_2:
    st.write('sarasa')
with col_3:
    st.write('sarasa')

col1_m1, col1_m2, col1_m3 = st.columns(3)

with col1_m1:
    st.metric(data['Potencia Pico SADI (MW)'].mean())

with col2_m2:
    st.metric(data['Potencia Pico SADI (MW)'].mean())

with col3_m3:
    st.metric(data['Potencia Pico SADI (MW)'].mean())
