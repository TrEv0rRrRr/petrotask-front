const fs = require('fs');
const path = require('path');

// Configuración
const languages = ['es', 'en'];
const features = ['iam', 'planning', 'resources', 'executions', 'billing', 'notifications'];
const i18nPath = path.join(__dirname, '../public/i18n');

// Función para leer un archivo JSON
function readJsonFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.warn(`Error reading ${filePath}:`, error.message);
  }
  return {};
}

// Función para escribir un archivo JSON
function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ Updated: ${filePath}`);
  } catch (error) {
    console.error(`❌ Error writing ${filePath}:`, error.message);
  }
}

// Función para combinar traducciones
function mergeTranslations() {
  languages.forEach(lang => {
    const mainFile = path.join(i18nPath, `${lang}.json`);
    let mainTranslations = readJsonFile(mainFile);
    
    // Agregar traducciones compartidas
    const sharedFile = path.join(i18nPath, 'shared', `${lang}.json`);
    const sharedTranslations = readJsonFile(sharedFile);
    mainTranslations = { ...mainTranslations, ...sharedTranslations };
    
    // Agregar traducciones de features
    features.forEach(feature => {
      const featureFile = path.join(i18nPath, 'features', feature, `${lang}.json`);
      const featureTranslations = readJsonFile(featureFile);
      mainTranslations = { ...mainTranslations, ...featureTranslations };
    });
    
    // Escribir archivo combinado
    writeJsonFile(mainFile, mainTranslations);
  });
}

// Ejecutar
console.log('🔄 Merging i18n files...');
mergeTranslations();
console.log('✅ i18n merge completed!'); 