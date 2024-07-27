import Image from './Avater'
export  function callProfileUrl  (name)  {
try {

    let setImageName = [    
      { url: Image.MaleAvatar1, name: "Male1" },
      { url: Image.MaleAvatar2,name: "Male2" },
      { url: Image.MaleAvatar3,name: "Male3" },
      { url: Image.MaleAvatar4,name: "Male4" },
      { url: Image.FemaleAvatar1, name: "FeMale1" },
      { url: Image.FemaleAvatar2, name: "FeMale2" },
      { url: Image.FemaleAvatar3, name: "FeMale3" },
      { url: Image.FemaleAvatar4, name: "FeMale4" },
      {url:Image.institutionImage ,name:"institutionImage"}
    ]
      setImageName = [...setImageName.filter(task => task.name == name )]

      return setImageName[0].url

} catch (error) {
    throw error
}
}


export  function callInstitutionUrl  (name)  {
    try {

          return Image.institutionImage
    
    } catch (error) {
        throw error
    }
    }