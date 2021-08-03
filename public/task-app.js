const userDetails = document.querySelector('.user-details')
const task_input = document.querySelector('.task_input')
const submit_task_btn = document.querySelector('.submit_task_btn')
const task_list = document.querySelector('.tasks_list')
let logged_in = false
let user_id = ''
let unsubscribe;
let serverTimestamp;
let completed;
let checkState = [];

console.log('app is ready')

// real-time data

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
            // .orderBy("createdAt", "asc")
            .orderBy("completed", "asc")
            .onSnapshot(querySnapshot => {
                checkState = []
                // task_list.innnerHTML = ''
                // console.log('change')
                const items = querySnapshot.docs.map(doc => {
                    checkState.push(doc.data().completed)
                    if (doc.data().completed) {
                        completed = "completed"
                    }
                    else {
                        completed = ""
                    }
                    return newTaskDiv(doc.data().name, doc.id, completed )
                })
                
                task_list.innerHTML = items.join(' ')
                changeCheckState()
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

const newTaskDiv = (name, id, completed) => {

    return `<div class = "task shadow" id="${id}">
                <p id="${id}-p" class="${completed}">${name}</p>
                <div class = "icons">
                    <input type="checkbox">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </div>
            </div>`
}

task_list.onclick =  (e) => {
    const element = e.target
    // console.log(element.innerHTML)
    const id = element.parentElement.parentElement.id
    if (id){
        if( element.type == "checkbox"){
            document.querySelector(`#${id}-p`).classList.toggle('completed')
            tasksRef.doc(id).update({"completed":element.checked})
        }
        else if (element.classList.contains('fa')) {
            tasksRef.doc(id).delete().then(console.log(`item with id ${id} was deleted`))
        }
    }
    
}

const changeCheckState = ()=> {
    let i = 0;
    document.querySelectorAll('.icons input').forEach(el => {
        el.checked = checkState[i]
        i++;
    })
}


    // const div_li = document.createElement(`div`)
    // const name_p = document.createElement(`name_p`)
    // const icons = document.createElement(`div`)
    // const checkbox = document.createElement('input')
    // const trash = document.createElement('i')

    // div_li.classList.add('task','shadow')
    // div_li.setAttribute('id', `${id}`)

    // if (completed) {
    //     name_p.classList.add(`${completed}`)
    // }

    // name_p.textContent = name
    // name_p.setAttribute('id',id+'-p')

    // icons.classList.add('icons')

    // checkbox.setAttribute('type', 'checkbox')

    // trash.classList.add('fa', 'fa-trash')
    // trash.setAttribute('aria-hidden', 'true')

    // icons.appendChild(checkbox)
    // icons.appendChild(trash)

    // div_li.appendChild(name_p)
    // div_li.appendChild(icons)

    // console.log(div_li)
    // task_list.innnerHTML = ''
    // task_list.appendChild(div_li)

    // return div_li

                    // querySnapshot.docChanges().forEach(change => {
                //     if (change.type === "added") {
                //         console.log('add')
                //         console.log(change.doc.data())
                //     }
                //     if (change.type === "removed") {
                //         console.log('rem')
                //         console.log(change)
                //     }
                //     if (change.type === "modified") {
                //         console.log('mod')
                //         console.log(change.doc.data())
                //     }
                // })