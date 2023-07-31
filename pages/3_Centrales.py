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


#Show centrales
st.subheader('Centrales')
st.write(centrales)



st.pydeck_chart(pdk.Deck(
    map_style=None,
    initial_view_state=pdk.ViewState(
        latitude=-34.6,
        longitude=-58.4,
        zoom=3,
        pitch=50,
    ),
    layers=[
        pdk.Layer(
           'GridLayer',
           data=centrales,
           get_position='[lon, lat]',
           radius=125,
           elevation_scale=10,
           elevation_range=[0, 1000],
           pickable=True,
           extruded=True,
           tooltip=True,
        ),
    
    ],
))


centrales['Tooltip'] = centrales['Nemo'] + ' (' + centrales['Potencia'].astype(str) + ' MW)'

# Muestra los detalles de la central seleccionada en el mapa
selected_central = st.pydeck_chart(pdk.Deck(
    #map_style='mapbox://styles/mapbox/light-v9',
    initial_view_state=pdk.ViewState(
        latitude=-34.6,
        longitude= -58.4,
        zoom=3,
        pitch=0,
    ),
    layers=[
        pdk.Layer(
            'ScatterplotLayer',
            data=centrales,
            get_position='[lon, lat]',
            get_radius=10000,
            get_color=[255, 0, 0],
            pickable=True,
            tooltip='Tooltip',
        ),
    ],
))
