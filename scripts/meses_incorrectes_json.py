# -*- coding: utf-8 -*-
import pandas as pd
import json
import datetime

df_vots = pd.read_csv('../data/votscdr.csv',na_values="-")
df_vots_mesa_incorrecta = df_vots[(df_vots['mesacorrecte']==0) & (df_vots['mesatancada']==1)]
print "Meses incorrectes: " + str(len(df_vots_mesa_incorrecta))

# Fer join amb meses
df_meses = pd.read_csv('../data/meses.csv', dtype={"COD_PROV":str})
df_join = pd.merge(df_vots_mesa_incorrecta, df_meses, how='left', left_on='codimesa', right_on='CODI_MESA')

df_join['COD_PROV'].fillna('-',inplace=True)
df_join['CODI_MUNICIPI'].fillna('-',inplace=True)
df_join['MUNICIPI'].fillna('-',inplace=True)
df_join['COMARCA'].fillna('-',inplace=True)

# Fer join amb resultats oficials
df_vots_oficial = pd.read_csv('../data/09-mes_adaptat.csv',sep=";", dtype={"Codi circumscripció":str,'Codi municipi':str,'Districte':str,'Secció':str,'Mesa':str})
df_vots_oficial['CODI_MESA'] = df_vots_oficial['Codi circumscripció'] + df_vots_oficial['Codi municipi'] + df_vots_oficial['Districte'] + df_vots_oficial['Secció'].str.strip() + df_vots_oficial['Mesa']
df_join_2 = pd.merge(df_join, df_vots_oficial, how='left', left_on=['CODI_MESA'], right_on=['CODI_MESA'])

# Generar vots per mesa incorrecta
with open('../data/vots_per_mesa_incorrecta.json','w') as vots_file:
    vots_file.write(json.dumps(json.loads(df_join_2.to_json(orient='records')), indent=4))
    print 'vots_per_mesa_incorrecta.json generat!'
