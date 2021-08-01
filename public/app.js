const signInBtn = document.querySelector('.signInBtn')
const signOutBtn = document.querySelector('.signOutBtn')
const userDetails = document.querySelector('.user-details')
const task_input = document.querySelector('.task_input')
const submit_task_btn = document.querySelector('.submit_task_btn')
const main = document.querySelector('main')
const db = firebase.firestore()
const task_list = document.querySelector('.tasks_list')
let logged_in = false
let user_id = ''
let tasksRef;
let unsubscribe;
let serverTimestamp;
tasksRef = db.collection('tasks')


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

// authentication
const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider()

signInBtn.onclick = () => {
    auth.signInWithPopup(provider)
}

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        signIn()
        logged_in = true
        user_id = user.uid

        const newUser = `<h3> Hello, ${user.displayName} </h3>`
        userDetails.innerHTML = newUser
        serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
        unsubscribe = tasksRef
            .where('uid', '==', user.uid)
            .orderBy("createdAt", "asc")
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return newTaskDiv(doc.data().name, doc.id, serverTimestamp())
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
        name: task_input.value,
        completed: false,
        createdAt: serverTimestamp()
    }
    tasksRef.add(createNewTask)
    task_input.value = ''
    
}



const newTaskDiv = (name, id) => {
    return `<div class = "task shadow" id="${id}">
                <p id=${id}-p>${name}</p>
                <div class = "icons">
                    <input id="${id}" type="checkbox">
                    <i id="${id}" class="fa fa-trash" aria-hidden="true"></i>
                </div>
            </div>`
}

task_list.onclick =  (e) => {
    const element = e.target
    const id = element.id
    console.log(element.type)
    if (id){
        if( element.type == "checkbox"){
            // console.log(document.querySelector('.icons > input'))
            document.querySelector('.icons > input').classList.add('completed')
            db.batch().update(tasksRef.doc(id), {"completed":element.checked})
        }
        else {
            tasksRef.doc(id).delete().then(console.log(`item with id ${id}, deleted`))
        }
    }
    
}