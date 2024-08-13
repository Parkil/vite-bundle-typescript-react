export const unloadScript = () => {
  return `
    // recoble script
    let executed = false  
  
    window.addEventListener("beforeunload", () => {
      if (!executed) {  
        console.log('beforeunload run')  
        window.setRecoblePageUnloadEvent()
        executed = true  
      }  
    })  
    
    window.addEventListener("pagehide", () => {
      if (!executed) {  
        console.log('pagehide run')
        window.setRecoblePageUnloadEvent()  
        executed = true  
      }  
    })  
    
    document.addEventListener('visibilitychange', () => {
      const visibilityState = document.visibilityState  
    
      if (visibilityState === 'hidden') {  
        if (!executed) {  
          console.log('visibilitychange run')
          window.setRecoblePageUnloadEvent()  
          executed = true  
        }  
      }  
    })  
  `
}
