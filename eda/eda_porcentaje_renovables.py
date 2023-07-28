# -*- coding: utf-8 -*-
"""
Created on Wed Jul 26 15:56:38 2023

@author: arsan
"""

import seaborn as sns 
import matplotlib.pyplot as plt
import pandas as pd
import geopandas as gpd
import numpy as np
import requests

data = pd.read_csv("centrales.csv")

data.head(10)

# uso la API georef_ar para hacer el mapa de argentina 

# gdf = gpd.read_file('https://apis.datos.gob.ar/georef/api/provincias?formato=shp&max=5000')

gdf = gpd.read_file('provincias\provincias\provincias.shp') # usamos el archivo directamente

gdf['IN1'] = gdf['IN1'].astype(float)  # IN1 es el campo provincia_id en el geodataframe

gdf.plot(figsize=(10, 10))

#%%

# quiero agregar una columna con el porcentaje de energ.ren y no ren. para cada provincia 

# primero lo hago en el DF data, luego agrego en el DF gdf

provincias_totales = data['provincia_id'].unique()
conteo = data.groupby('provincia_id')['Tipo_eco'].count() # Cantidad total de centrales por cada prov.
conteo = conteo.reindex(provincias_totales, fill_value=0) # Agregamos la provincia con ID nan
    
conteo_renovables = data[data['Tipo_eco'] == 'Renovable'].groupby('provincia_id')['Tipo'].count()
conteo_renovables = conteo_renovables.reindex(provincias_totales, fill_value=0)
porcent_renov = (conteo_renovables/conteo*100).to_frame()  ## LO QUE ME INTERESA

conteo_no_renovables = data[data['Tipo_eco'] == 'No Renovable'].groupby('provincia_id')['Tipo'].count()
conteo_no_renovables = conteo_no_renovables.reindex(provincias_totales, fill_value=0)
porcent_no_renov = (conteo_no_renovables/conteo*100).to_frame() ## LO QUE ME INTERESA
#%% 

# Realizo un merge entre las series obtenidas y el GDF

data_mergeada = gdf.merge(porcent_renov, left_on='IN1', right_on = 'provincia_id', how = 'left').merge(porcent_no_renov, left_on = 'IN1', right_on = 'provincia_id', how = 'left')

data_mergeada.rename(columns= {'0_x':'porcent_ren', '0_y':'porcent_no_ren'}, inplace = True) # renombro campos agregados

#%% 

data_mergeada.plot('porcent_ren', legend = True, cmap = 'RdYlGn')