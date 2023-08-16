import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium

st.set_page_config(
    page_title="Ubicación de centrales",
    page_icon="🌎",
    layout="wide",
)

st.write("""
# Ubicación de cada central en Argentina

En este mapa interactivo, podrás encontrar la ubicación geográfica de cada central.
Cada una está representada por un color para diferenciarlas con mayor facilidad y 
podrás filtrarlas haciendo clic en las siguientes opciones:
""")

colores = {
    'eolicas': 'green',
    'hidraulica': 'blue',
    'nuclear': 'orange',
    'solar': 'pink',
    'termicas': 'red',
}

sadi = pd.read_csv('eda/data/cammesa/sadi_centrales.csv', sep=";")
df_sadi = sadi[['id', 'Nombre', 'Nemo', 'Tipo', 'Potencia', 'Region', 'lat', 'lon']]
df_sadi = df_sadi.dropna()

col1, col2 = st.columns(2)
col3, col4 = st.columns(2)
col5, _ = st.columns(2)

eolicas = col1.checkbox('🍃 Eólicas - Verde', value=True)
hidraulica = col2.checkbox('💧 Hidráulica - Azul', value=True)
nuclear = col3.checkbox('☢️ Nuclear - Naranja', value=True)
solar = col4.checkbox('☀️ Solar - Rosa', value=True)
termicas = col5.checkbox('🌡️ Térmicas - Rojo', value=True)
checkboxs = {
    'eolicas': eolicas,
    'hidraulica': hidraulica,
    'nuclear': nuclear,
    'solar': solar,
    'termicas': termicas,
}

mapa = folium.Map(location=[-34.6, -58.4], zoom_start=4)
for idx in range(len(df_sadi)):
    if checkboxs[df_sadi.iloc[idx]['Tipo']]:
        location = df_sadi.iloc[idx][['lat', 'lon']]
        folium.Marker(
            location=location,
            popup=f"{df_sadi.iloc[idx]['Tipo']}: {df_sadi.iloc[idx]['Nombre']}",
            icon=folium.Icon(color=colores[df_sadi.iloc[idx]['Tipo']], icon='bolt', prefix='fa')
        ).add_to(mapa)
st_folium(mapa, width=1420)
