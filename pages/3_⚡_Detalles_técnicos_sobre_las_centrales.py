import pandas as pd
import pydeck as pdk
import streamlit as st
import requests
from io import StringIO
import plotly.express as px
from plotly.subplots import make_subplots
import plotly.graph_objects as go
import matplotlib.pyplot as plt


st.set_page_config(
    page_title="Centrales",
    page_icon=":)",
    layout="wide",
)

st.title('Distribucion de las Centrales electricas en Argentina')

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


centrales_gridlayer = centrales[['lat', 'lon', 'Potencia', 'Tipo']]
centrales_gridlayer['Tooltip_1'] = 'Potencia ' + centrales_gridlayer['Potencia'].astype(str) + ' MW - Tipo: ' + centrales['Tipo'].astype(str)


# Crear una columna para el mapa y otra para el gráfico
col1, col2 = st.columns(2)

# Gráfico de potencia instalada por provincia en la segunda columna
with col1:
    st.title("Potencia Instalada por Provincia y tipo de central")
    #st.markdown('')
    st.write("Se puede elegir una provincia en la barra lateral para ver la potencia instalada por tipo de central en esa provincia")

    # Seleccionar una provincia desde la barra lateral
    selected_province = st.sidebar.selectbox('Selecciona una provincia', centrales['provincia'].unique())

    # Filtrar los datos por la provincia seleccionada
    province_data = centrales[centrales['provincia'] == selected_province]

    # Crear un DataFrame con la suma de potencia instalada por tipo de eco
    eco_type_power = province_data.groupby('Tipo_eco')['Potencia'].sum().reset_index()

    # Agregar colores según el Tipo_eco
    colores_tipo_eco = {
        'Renovable': 'green',
        'Transicion': 'blue',
        'No renovable': 'red'
    }
    eco_type_power['Color'] = eco_type_power['Tipo_eco'].map(colores_tipo_eco)

    # Crear el gráfico de barras con colores personalizados
    fig = px.bar(
        eco_type_power,
        x='Tipo_eco',
        y='Potencia',
        color='Tipo_eco',  # Colorear las barras según el Tipo_eco
        labels={'Potencia': 'Potencia (MW)'},
        title=f'Potencia instalada por tipo de central en {selected_province}',
    )

    # Mostrar el gráfico en Streamlit
    st.plotly_chart(fig)


# Mostrar el mapa en la primera columna
with col2:
    st.title("Central Electrica")
    st.write("""
             Distribución geográfica de la potencia instalada en las centrales eléctricas de Argentina.
         """)
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


#Visualizacion del dataset centrales
st.subheader('Dataset de centrales')
st.write("""
A continuación se muestran los datos utilizados para la realización de las visualizaciones
""")

            
        
