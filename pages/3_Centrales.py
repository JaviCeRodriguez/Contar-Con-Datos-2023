import pandas as pd
import pydeck as pdk
import streamlit as st

st.set_page_config(
    page_title="Centrales",
    page_icon=":)",
    layout="wide",
)

st.title('Centrales')
st.write("HI")

#Read centrales
centrales = pd.read_csv('data/centrales.csv')


#data_load_state = st.text('Loading data...')
#centrales = load_data()
#data_load_state.text('Loading data...done!')

#Show centrales
st.subheader('Centrales')
st.write(centrales)



st.pydeck_chart(pdk.Deck(
    map_style=None,
    initial_view_state=pdk.ViewState(
        latitude=34.6,
        longitude=-58.4,
        zoom=5,
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
        zoom=5,
        pitch=0,
    ),
    layers=[
        pdk.Layer(
            'ScatterplotLayer',
            data=centrales,
            get_position='[Lon, Lat]',
            get_radius=10000,
            get_color=[255, 0, 0],
            pickable=True,
            tooltip='Tooltip',
        ),
    ],
))