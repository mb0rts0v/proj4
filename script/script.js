import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

document.addEventListener('DOMContentLoaded', function () {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const burgerBtn = document.getElementById('burger');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');
    const modalDialog = document.querySelector('.modal-dialog');
  
    // Конфігурація Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCSRhIRkzCq1DXBJpwD5PYJp2N80PtmUzo",
        authDomain: "testburger-f27ba.firebaseapp.com",
        databaseURL: "https://testburger-f27ba-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "testburger-f27ba",
        storageBucket: "testburger-f27ba.firebasestorage.app",
        messagingSenderId: "329084799894",
        appId: "1:329084799894:web:877244de77ff1743a1ebb7",
        measurementId: "G-793ZNV2QBV"
    };
    
    // Ініціалізація Firebase
    const app = initializeApp(firebaseConfig);
    
    const getData = () => {
        formAnswers.textContent = 'Завантаження...';

        nextButton.classList.add('d-none');
        prevButton.classList.add('d-none');

        setTimeout(() => {
            const db = getDatabase();
            get(ref(db, 'questions'))
            .then((snapshot) => {
                if (snapshot.exists()) {
                    playTest(snapshot.val());
                } else {
                    console.log("Дані відсутні");
                }
            })
            .catch((error) => {
                console.error("Помилка при завантаженні даних:", error);
            });
        }, 500)
    }


    let clientWidth = document.documentElement.clientWidth;

    if(clientWidth < 768) {
        burgerBtn.style.display = "flex";
    } else {
        burgerBtn.style.display='none';
    }

    const questions = [{
        question: "Якого кольору бургер?",
        answers: [{title: 'Стандарт', url: './image/burger.png' },
            {title: 'Темний', url: './image/burgerBlack.png' }
        ],
        type: 'radio'
    },
    {
        question: "З якого м’яса котлета?",
        answers: [{ title: 'Курка', url: './image/chickenMeat.png' },
            { title: 'Яловичина', url: './image/beefMeat.png' },
            {title: 'Свинина', url: './image/porkMeat.png' }
        ],
        type: 'radio'
    },
    {
        question: "Додаткові інгредієнти?",
        answers: [{ title: 'Помідор', url: './image/tomato.png' },
            { title: 'Огірок', url: './image/cucumber.png' },
            { title: 'Салат', url: './image/salad.png' },
            { title: 'Цибуля', url: './image/onion.png' }
        ],
        type: 'checkbox'
    },
    {
        question: "Додати соус?",
        answers: [{ title: 'Часниковий', url: './image/sauce1.png' },
            { title: 'Томатний', url: './image/sauce2.png' },
            { title: 'Гірчичний', url: './image/sauce3.png' }
        ],
        type: 'radio'
    }
];
    let count = -100;
    let interval;

    modalDialog.style.top='-100%';

    const animateModal = () => {
        modalDialog.style.top = count + '%';
        count+=4;
        if(count < 0) {
            requestAnimationFrame(animateModal);
        } else {
            count -= 100;
        }
        
    };

    window.addEventListener('resize', function () {
        clientWidth = document.documentElement.clientWidth;
        
        if (clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none';
        }
    });

    burgerBtn.addEventListener('click', function () {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    })


    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        getData();
    });


    document.addEventListener('click', function(event) {
        if (
            !event.target.closest('.modal-dialog') &&
            !event.target.closest('.openModalButton') &&
            !event.target.closest('.burger')
        ) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
        }
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });

    const playTest = (questions) => {
        const finalAnswers = [];
        let numberQuestion = 0;

        const renderAnswers = (index) => {
            

            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                <img class="answerImg" src="${ answer.url }" alt="burger">
                <span>${ answer.title }</span>
                </label>
                `;

                formAnswers.appendChild(answerItem);
            })
        }

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
        
            switch (true) {
                case (numberQuestion >= 0 && numberQuestion <= questions.length - 1):
                    questionTitle.textContent = `${questions[indexQuestion].question}`;
                    renderAnswers(indexQuestion);
                    nextButton.classList.remove('d-none');
                    prevButton.classList.remove('d-none');
                    sendButton.classList.add('d-none');
                    break;
        
                case (numberQuestion === 0):
                    prevButton.classList.add('d-none');
                    break;
        
                case (numberQuestion === questions.length):
                    questionTitle.textContent = '';
                    nextButton.classList.add('d-none');
                    prevButton.classList.add('d-none');
                    sendButton.classList.remove('d-none');
                    formAnswers.innerHTML = `
                        <div class="form-group">
                            <label for="numberPhone">Введіть ваш номер</label>
                            <input type="phone" class="form-control" id="numberPhone">
                        </div>
                    `;
                    break;
        
                case (numberQuestion === questions.length + 1):
                    questionTitle.textContent = '';
                    formAnswers.textContent = 'Дякуємо за пройдений тест!';
                    setTimeout(() => {
                        modalBlock.classList.remove('d-block');
                    }, 2000);
                    break;
            }
        };
        
        
        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};
            const inputs = [...formAnswers.elements].filter((input) => input.checked || input.id === 'numberPhone');

            inputs.forEach((input, index) => {
                if(numberQuestion >= 0 && numberQuestion <= questions.length - 1){
                    obj[`${index}_${questions[numberQuestion].question}`] = input.value;
                }

                if(numberQuestion === questions.length){
                    obj['Номер телефону'] = input.value;
                }
            })

            finalAnswers.push(obj);
        }

        nextButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
        }

        prevButton.onclick = () => {
            numberQuestion--;
            renderQuestions(numberQuestion);
        }

        sendButton.onclick = () => {
            checkAnswer();
            numberQuestion++;
            renderQuestions(numberQuestion);
            const db = getDatabase();
            push(ref(db, 'contacts'), finalAnswers)
                .then(() => {
                    console.log("Дані збережено успішно!");
                })
                .catch((error) => {
                    console.error("Помилка при збереженні даних:", error);
                });
        }
    };
});
