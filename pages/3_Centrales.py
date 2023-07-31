import pandas as pd
import pydeck as pdk
import streamlit as st
import requests
from io import StringIO

st.set_page_config(
    page_title="Centrales",
    page_icon=":)",
    layout="wide",
)

st.title('Centrales')
st.write("HI")

# URL del archivo CSV en el repositorio de GitHub
url = 'https://raw.githubusercontent.com/lucas-oliaro/Contar-Con-Datos-2023/main/eda/data/cammesa/centrales.csv'

# Descargar el contenido del archivo CSV desde GitHub
response = requests.get(url)
csv_content = response.text

# Cargar el contenido del archivo CSV en un DataFrame de pandas
centrales = pd.read_csv(StringIO(csv_content), index_col=0, sep=',')

#drop nan en centrales
centrales = centrales.dropna()
colores_centrales = {
    'eolicas': "#00FF00",    # Green for 'eolicas'
    'hidraulica': "#0000FF", # Blue for 'hidraulica'
    'nuclear': "#FFA500",    # Orange for 'nuclear'
    'solar': "#FFFF00",      # Yellow for 'solar'
    'termicas': "#FF0000",   # Red for 'termicas'
}


#Show centrales
st.subheader('Centrales')
st.write(centrales)

#Mapa 1
centrales_gridlayer = centrales[['lat', 'lon', 'Potencia', 'Tipo']]
centrales_gridlayer['Tooltip_1'] = 'Potencia ' + centrales_gridlayer['Potencia'].astype(str) + ' MW - Tipo: ' + centrales['Tipo'].astype(str)

st.pydeck_chart(pdk.Deck(
    map_style='mapbox://styles/mapbox/light-v9',
    
    initial_view_state=pdk.ViewState(
        latitude=-34.6,
        longitude=-58.4,
        zoom=3,
        pitch=50,
        ),
    
    tooltip={"text": "Potencia: {Potencia} MW \nTipo: {Tipo}"},  # doesn't work (not sure why)    
    
    layers=[
        pdk.Layer(
           'GridLayer',
           data=centrales_gridlayer,
           pickable=True,
           extruded=True,
           cell_size=10000, 
           elevation_scale=100,
           get_position='[lon, lat]',
           elevation_range=[0, 2541],
           ),
    
    ],

))
