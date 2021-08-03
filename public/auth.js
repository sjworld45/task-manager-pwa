console.log('auth is ready')
const signInBtn = document.querySelector('.signInBtn')
const signOutBtn = document.querySelector('.signOutBtn')
const main = document.querySelector('main')

const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider()

const signIn = () => {  
    signInBtn.classList.remove('visible')
    signInBtn.classList.add('hidden')
    signOutBtn.classList.remove('hidden')
    signOutBtn.classList.add('visible')
    main.classList.add('visible')
    
    }
    
const signOut = () => {
    signInBtn.classList.remove('hidden')
    signInBtn.classList.add('visible')
    signOutBtn.classList.remove('visible')
    signOutBtn.classList.add('hidden')
    main.classList.add('hidden')
}



signInBtn.onclick = () => {
    auth.signInWithPopup(provider)
}

signOutBtn.onclick = () => auth.signOut();