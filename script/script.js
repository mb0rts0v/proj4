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

    let clientWidth = document.documentElement.clientWidth;
    let answersLog = [];
    let numberQuestion = 0;

    if (clientWidth < 768) {
        burgerBtn.style.display = 'flex';
    } else {
        burgerBtn.style.display = 'none';
    }

    window.addEventListener('resize', function () {
        clientWidth = document.documentElement.clientWidth;
        if (clientWidth < 768) {
            burgerBtn.style.display = 'flex';
        } else {
            burgerBtn.style.display = 'none';
        }
    });

    const questions = [
        {
            question: "Якого кольору бургер?",
            answers: [
                { title: 'Стандарт', url: './image/burger.png' },
                { title: 'Чорний', url: './image/burgerBlack.png' }
            ],
            type: 'radio'
        },
        {
            question: "З якого м'яса котлета?",
            answers: [
                { title: 'Курка', url: './image/chickenMeat.png' },
                { title: 'Яловичина', url: './image/beefMeat.png' },
                { title: 'Свинина', url: './image/porkMeat.png' }
            ],
            type: 'radio'
        },
        {
            question: "Додаткові інгредієнти?",
            answers: [
                { title: 'Помідор', url: './image/tomato.png' },
                { title: 'Огірок', url: './image/cucumber.png' },
                { title: 'Салат', url: './image/salad.png' },
                { title: 'Цибуля', url: './image/onion.png' }
            ],
            type: 'checkbox'
        },
        {
            question: "Додати соус?",
            answers: [
                { title: 'Часниковий', url: './image/sauce1.png' },
                { title: 'Томатний', url: './image/sauce2.png' },
                { title: 'Гірчичний', url: './image/sauce3.png' }
            ],
            type: 'radio'
        },
        {
            question: "Введіть свій номер телефону",
            answers: [],
            type: 'text'
        }
    ];

    let count = -100;
    const animateModal = () => {
        modalDialog.style.top = count + '%';
        count += 4;
        if (count < 0) {
            requestAnimationFrame(animateModal);
        } else {
            count = -100;
        }
    };

    btnOpenModal.addEventListener('click', () => {
        requestAnimationFrame(animateModal);
        modalBlock.classList.add('d-block');
        playTest();
    });

    burgerBtn.addEventListener('click', function () {
        burgerBtn.classList.add('active');
        modalBlock.classList.add('d-block');
        playTest();
    });

    document.addEventListener('click', function(event) {
        if (
            !event.target.closest('.modal-dialog') &&
            !event.target.closest('#btnOpenModal') &&
            !event.target.closest('#burger')
        ) {
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
        }
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
        burgerBtn.classList.remove('active');
    });

    const playTest = () => {
        const renderAnswers = (index) => {
            formAnswers.innerHTML = '';

            if (questions[index].type === 'text') {
                formAnswers.innerHTML = `
                    <input type="tel" id="phoneNumber" name="phone" placeholder="Введіть номер телефону" class="form-control mb-3">
                    <button id="submitPhone" class="btn btn-primary">Відправити</button>
                `;
                document.querySelector('#submitPhone').addEventListener('click', () => {
                    const phoneInput = document.querySelector('#phoneNumber').value;
                    if (phoneInput) {
                        answersLog.push({ question: questions[index].question, answer: phoneInput });
                        console.log("Фінальний звіт:", answersLog);
                        modalBlock.classList.remove('d-block');
                        burgerBtn.classList.remove('active');
                    }
                });
            } else {
                questions[index].answers.forEach((answer) => {
                    const answerItem = document.createElement('div');
                    answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');
                    answerItem.innerHTML = `
                        <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none">
                        <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                            <img class="answerImg" src="${answer.url}" alt="burger">
                            <span>${answer.title}</span>
                        </label>
                    `;
                    formAnswers.appendChild(answerItem);
                });
            }
        };

        const renderQuestions = (indexQuestion) => {
            questionTitle.textContent = questions[indexQuestion].question;
            renderAnswers(indexQuestion);

            prevButton.classList.toggle('hidden', numberQuestion === 0);
            nextButton.classList.toggle('hidden', numberQuestion === questions.length - 1);
            sendButton.classList.toggle('d-none', numberQuestion !== questions.length - 1);
        };

        renderQuestions(numberQuestion);

        nextButton.onclick = () => {
            saveAnswer();
            if (numberQuestion < questions.length - 1) {
                numberQuestion++;
                renderQuestions(numberQuestion);
            }
        };

        prevButton.onclick = () => {
            if (numberQuestion > 0) {
                numberQuestion--;
                renderQuestions(numberQuestion);
            }
        };

        sendButton.onclick = () => {
            saveAnswer();
            console.log("Всі відповіді збережено:", answersLog);
            modalBlock.classList.remove('d-block');
            burgerBtn.classList.remove('active');
            resetQuiz();
        };
    };

    const saveAnswer = () => {
        const selectedAnswers = formAnswers.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        const answerTitles = Array.from(selectedAnswers).map(answer => answer.id);
        if (answerTitles.length > 0) {
            answersLog.push({ question: questions[numberQuestion].question, answer: answerTitles });
        }
    };

    const resetQuiz = () => {
        answersLog = [];
        numberQuestion = 0;
        playTest();
    };
});
