function getCronFromDB(DBName, mockDB = null){
  if(mockDB) return mockDB;
}

function setCronToDB(DBName, isMock = false){
  if(isMock) return;
}

module.exports = {
  getCronFromDB,
  setCronToDB,
}