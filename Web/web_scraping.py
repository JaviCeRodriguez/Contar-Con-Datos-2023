from bs4 import BeautifulSoup

#Read HTML file
with open('/media/lucas/Windows/Documentos/Aa_UNSAM/Contar con datos/Web/SADI.html', 'r') as html_file:
    doc = BeautifulSoup(html_file, 'html.parser')

print(doc.prettify())


tag = doc.title
print(tag)
#Inside the tag
print(tag.string)



#Find all the tables
#tables = doc.find_all('table')
