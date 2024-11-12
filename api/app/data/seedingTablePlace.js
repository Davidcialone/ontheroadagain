// Lire le fichier JSON
const jsonData = fs.readFileSync('chemin_vers_votre_fichier_json.json');
const data = JSON.parse(jsonData);

// Insérer les données dans la table "place"
data.states.forEach(async (state) => {
  await client.query(`
    INSERT INTO place 
    (city, cityLatitude, cityLongitude, country, countryLatitude, countryLongitude, continent, created_at, updated_at) 
    VALUES 
    ('${state.name}', '${state.latitude}', '${state.longitude}', '${data.name}', '${data.latitude}', '${data.longitude}', '${data.region}', '${data.created_at}', '${data.updated_at}')
    `);
}  