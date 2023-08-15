import streamlit as st
from streamlit_folium import st_folium
import matplotlib.pyplot as plt
import pandas as pd
import folium
import seaborn as sns
import numpy as np
import warnings

st.set_page_config(
    page_title="Inicio",
    page_icon="🏠",
    layout="wide",
)

# TODO: See https://github.com/randyzwitch/streamlit-folium/blob/master/examples/pages/dynamic_updates.py

sns.set(rc={'figure.figsize':(20, 6)})
warnings.filterwarnings('ignore')
colores = {
    'eolicas': 'green',
    'hidraulica': 'blue',
    'nuclear': 'orange',
    'solar': 'pink',
    'termicas': 'red',
}

st.title('Análisis de consumo energético vía CAMMESA')

st.write("""
#Propósito del trabajo
Este trabajo busca entender la distribución energética argentina, con el fin de descubrir posibles patrones de interés.
Para esto se realizará un análisis exploratorio de datos obtenidos a través de la web de CAMESSA y su API. 
""")

sadi = pd.read_csv('eda/data/cammesa/sadi_centrales.csv', sep=";")
df_sadi = sadi[['id', 'Nombre', 'Nemo', 'Tipo', 'Potencia', 'Region', 'lat', 'lon']]
df_sadi = df_sadi.dropna()


df_sadi_potencias = df_sadi \
    .groupby(['Tipo', 'Region']) \
    .agg({
        'Potencia': np.sum
    }) \
    .reset_index()
fig = plt.figure(figsize=(20, 6))
ax = sns.barplot(df_sadi_potencias, x='Tipo', y='Potencia', hue='Region', errorbar=None, width=0.9)
for i in ax.containers:
    ax.bar_label(i, )
st.pyplot(fig)


st.title('Ubicación de centrales diferenciadas por tipo')
eolicas = st.checkbox('Eólicas - Verde')
hidraulica = st.checkbox('Hidráulica - Azul')
nuclear = st.checkbox('Nuclear - Naranja')
solar = st.checkbox('Solar - Rosa')
termicas = st.checkbox('Térmicas - Rojo')
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
