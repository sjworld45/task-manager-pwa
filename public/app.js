const signInBtn = document.querySelector('.signInBtn')
const signOutBtn = document.querySelector('.signOutBtn')
const userDetails = document.querySelector('.user-details')
const task_input = document.querySelector('.task_input')
const submit_task_btn = document.querySelector('.submit_task_btn')
const db = firebase.firestore()
const task_list = document.querySelector('.tasks_list')
let logged_in = false
let user_id = ''
let tasksRef;
let unsubscribe;
        tasksRef = db.collection('tasks')


const signIn = () => {
        signInBtn.classList.remove('visible')
        signInBtn.classList.add('hidden')
        signOutBtn.classList.remove('hidden')
        signOutBtn.classList.add('visible')
}

const signOut = () => {
        signInBtn.classList.remove('hidden')
        signInBtn.classList.add('visible')
        signOutBtn.classList.remove('visible')
        signOutBtn.classList.add('hidden')
}

// authentication
const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider()

signInBtn.onclick = () => {
    console.log('click')
    auth.signInWithPopup(provider)
}

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    console.log('state changed')
    if (user) {
        signIn()
        logged_in = true
        user_id = user.uid

        const newUser = `<h3> Hello, ${user.displayName} </h3>`
        userDetails.innerHTML = newUser

        unsubscribe = tasksRef
            .where('uid', '==', user.uid)
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return newTask(doc.data().name)
                })
                task_list.innerHTML = items.join(' ')
            })
    }
    else {
        logged_in = false
        user_id = ''
        signOut()
        userDetails.innerHTML = ''
        task_list.innerHTML = ''
    }
})

submit_task_btn.onclick = (e) => {
    e.preventDefault()
    const createNewTask = {
        uid: user_id,
        name: task_input.value
    }
    tasksRef.add(createNewTask)
    task_input.value = ''
    
}



const newTask = (name) => {
    return `<div class = "task shadow"> ${name} </div>`
}