const LANGUAGES = {
  ru: {
    projectName: 'Presentation Maker',
    newPresentationTitle: 'Новая презентация',
    recentPresentations: 'Недавние',

    imageDialogHeading: 'Выберите файл',
    urlDialogHeading: 'Ссылка на изображение',
    colorDialogHeading: 'Выберите цвет',
    deleteDialogHeading: 'Подтверждение удаления',
    deleteDialogTextP1: 'Вы уверены, что хотите удалить презентацию «',
    deleteDialogTextP2: '»? Это действие нельзя отменить.',

    dialogImageTab: 'Файл',
    dialogUrlTab: 'Ссылка',
    dialogColorTab: 'Цвет',

    dialogCancel: 'Отмена',
    dialogSubmit: 'Добавить',
    dialogDelete: 'Удалить',

    noSlides: 'Слайдов нет',

    // AUTH
    loginTitle: 'Авторизация',
    submitLogin: 'Войти',
    registrationTitle: 'Регистрация',
    submitRegistration: 'Зарегистрироваться',
    loginToRegistration: 'Не зарегистрированы?',
    registrationToLogin: 'Зарегистрированы?',

    notFoundPage: 'Страница не существует, либо перенесена',
    logout: 'Выйти',

    // AuthPage CLIENT VALIDATION
    validateEmailErrorRequired: 'Email обязателен',
    validateEmailErrorType: 'Некорректный email',
    validatePasswordErrorRequired: 'Пароль обязателен',
    validatePasswordErrorMinLen: 'Пароль должен содержать минимум 8 символов',
    validateNameErrorRequired: 'Имя обязательно',
    validateNameErrorLen: 'Имя слишком короткое',

    // AuthPage SERVER VALIDATION
    serverErrorLoginFallback: 'Ошибка входа',
    serverErrorRegisterFallback: 'Ошибка входа',

    // TOAST MESSAGES
    save: 'Сохранение презентации...',
    presentationDeletedSuccess: 'Презентация успешно удалена',
    presentationDeletedFailure: 'Не удалось удалить презентацию',

    // Slider
    sliderErrorMessage: 'Презентация не найдена или недоступна.',
    sliderToNext: 'Следующий слайд.',
    sliderToPrev: 'Предыдущий слайд.',

    pages: {
      auth: 'Авторизация',
      collection: 'Коллекция',
      editor: 'Редактор',
      notFound: '404',
      viewer: 'Слайд-шоу',
    },

    toolbarButtons: {
      slideShow: 'Слайд-шоу',
      saveAsPdf: 'Сохранить презентацию в pdf',
      addSlide: 'Добавить слайд',
      removeSlide: 'Удалить активный слайд',
      addRectangle: 'Добавить прямоугольник',
      addText: 'Добавить текстовый элемент',
      changeBackground: 'Изменить фон',
      changeLayer: 'Изменить слой',
      topLayer: 'На верхний уровень',
      upperLayer: 'На уровень выше',
      lowerLayer: 'На уровень ниже',
      bottomLayer: 'На нижний уровень',
      undo: 'Отменить действие',
      redo: 'Повторить действие',
    },

    fonts: {
      fetchError: 'Не удалось загрузить шрифты: ',
    }
  },
};

export { LANGUAGES };
