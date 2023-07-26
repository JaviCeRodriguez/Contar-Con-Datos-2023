# -*- coding: utf-8 -*-
"""
Created on Wed Jul 26 13:22:43 2023

@author: arsan
"""

# Agregamos las provincias al DF utilizando la API georef_ar

import pandas as pd
import requests

data = pd.read_csv("sadi_centrales.csv", sep = ';')

# vamos a utilizar georreferenciacion inversa de la API georef_ar

# genero un json con los datos de la busqueda para la POST REQUEST: 

data_consulta = {
  "ubicaciones": [
    {
      "lat": latitude,
      "lon": 'longitude',
      "aplanar": "true",
      "campos": "estandar"
    }
    for latitude in data['lat']
  ]
}

for i in range(len(data_consulta['ubicaciones'])):
        data_consulta['ubicaciones'][i]['lon']=data['lon'][i]
        
resultado = requests.post("https://apis.datos.gob.ar/georef/api/ubicacion",
    json=data_consulta
).json()

# extraigo las provincias del json

resultado_formateado = [diccionarios['ubicacion']['provincia_nombre'] for diccionarios in resultado['resultados']]

data.insert(12, 'provincia', resultado_formateado)

data.to_csv('data_con_provincias.csv', index = False)