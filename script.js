const header = document.querySelector('.header__top');
const logo = document.querySelector('.header__top-inner__logo');
const menu_button = document.querySelector('.header__top-inner__button');
const menu = document.querySelector('.menu');
const menu_item_selected = document.querySelector('.menu__item--selected');
const menu_list = document.querySelector('.menu__list');
const menu_links = document.querySelectorAll('.menu__link');
const links = document.querySelectorAll('.menu__link, .header__top-inner__logo, .welcome__link');
const movableItem1 = document.querySelector('#movableItem-1');
const movableItem2 = document.querySelector('#movableItem-2');
const movableItem3 = document.querySelector('#movableItem-3');
const movableItem4 = document.querySelector('#movableItem-4');
const sections = document.querySelectorAll('section');
const section_images = document.querySelectorAll('.section__image');
const section_descriptions = document.querySelectorAll('.section-inner__description');
const benefitsIcons = document.querySelectorAll('.benefits__icon');
const contactIcons = document.querySelectorAll('.contact__icon');

const changeCSSRootStyles = (elements) => {
  elements.forEach(({ property, value }) => {
    document.documentElement.style.setProperty(`${property}`, `${value}`);
  });
};

const setOffsetOfElements = (elements) => {
  const offsetValues = [];
  const styles = [];

  elements.forEach((element) => {
    const elementId = element.getAttribute('id');
    const elementOffsetWithWidth = element.offsetLeft + element.offsetWidth;
    offsetValues.push({ elementId, elementOffsetWithWidth });
  });

  offsetValues.forEach((value) => {
    styles.push({
      property: `--movable-item${value.elementId.split('-')[1]}-offsetLeft`,
      value: `${value.elementOffsetWithWidth}px`,
    });
  });
  changeCSSRootStyles(styles);
};

const selectedButtonHandler = (selectedButton) => {
  let button;
  let buttonWidth = 0;
  let buttonOffsetLeft = 0;

  if (selectedButton !== 'none' && window.visualViewport.width > 767) {
    button = document.querySelector(`a[href="${selectedButton}"]`);
    buttonWidth = button.offsetWidth;
    buttonOffsetLeft = button.offsetLeft;
  }
  changeCSSRootStyles([
    { property: '--menu-item-selected-width', value: `${buttonWidth}` },
    {
      property: '--menu-item-selected-offsetLeft',
      value: `${buttonOffsetLeft}px`,
    },
  ]);
};

// HANDLE RESIZE
const handleResizeObserver = () => {
  if (activeSectionName && window.scrollY > 0) {
    selectedButtonHandler(activeSectionName);
  }
  setOffsetOfElements([...section_images, ...section_descriptions]);
  removeScrollObserver();
  setObserverThreshold();
  createNewScrollObserver(observer_threshold);
};

const resizeObserver = new ResizeObserver(handleResizeObserver);

resizeObserver.observe(document.documentElement);

// HANDLE SCROLL
let activeSectionName;
let observer;
let observer_threshold = 0.25;

const setObserverThreshold = () => {
  const viewWidth = window.visualViewport.width;
  const viewHeight = window.visualViewport.height;

  if (viewWidth > 750 && viewHeight > 1000) {
    observer_threshold = 0.75;
  }
  if (viewWidth > 900 && viewHeight > 1300) {
    observer_threshold = 0.9;
  }
  if (viewWidth > 1000 && viewHeight > 500) {
    observer_threshold = 0.65;
  }
};

const handleScrollObserver = (entries) => {
  entries.forEach((entry) => {
    const sectionId = entry.target.id;
    const isIntersecting = entry.isIntersecting;
    if (
      ((sectionId === 'about_me' ||
        sectionId === 'services' ||
        sectionId === 'benefits' ||
        sectionId === 'contact') &&
        isIntersecting) ||
      (sectionId === 'welcome' && !isIntersecting)
    ) {
      if (sectionId !== 'welcome') {
        activeSectionName = `#${sectionId}`;
        selectedButtonHandler(activeSectionName);
      }

      logo.classList.add('header__top-inner__logo--scrolled');
      header.classList.add('header__top--scrolled');
      switch (sectionId) {
        case 'about_me':
          {
            movableItem1.classList.add('section__image--move');
            movableItem2.classList.add('section-inner__description--move');
          }
          break;
        case 'services':
          {
            movableItem3.classList.add('section__image--move');
            movableItem4.classList.add('section-inner__description--move');
          }
          break;
        case 'benefits':
          {
            benefitsIcons.forEach((icon, index) => {
              icon.classList.add(`benefits__icon--bounce${index + 1}`);
            });
          }
          break;
        case 'contact':
          {
            contactIcons.forEach((icon, index) => {
              icon.classList.add(`contact__icon--bounce${index + 1}`);
            });
          }
          break;
        default:
          break;
      }
    } else if (sectionId === 'welcome' && isIntersecting) {
      logo.classList.remove('header__top-inner__logo--scrolled');
      header.classList.remove('header__top--scrolled');
      selectedButtonHandler('none');
      menuLinkHandler();
    }
  });
};

const createNewScrollObserver = (threshold) => {
  observer = new IntersectionObserver(handleScrollObserver, {
    threshold,
  });

  sections.forEach((section) => {
    observer.observe(section);
  });
};

const removeScrollObserver = () => {
  sections.forEach((section) => {
    if (observer) {
      observer.unobserve(section);
    }
  });
};

// HANDLE CLICK
const menuHandler = () => {
  menu.classList.toggle('menu--open');
};

const menuLinkHandler = (e) => {
  menu_links.forEach((menu_link) => menu_link.classList.remove('menu__link--active'));

  if (e) {
    const url = e.target.getAttribute('href');
    const button = document.querySelector(`a[href="${url}"]`);
    button.classList.toggle('menu__link--active');
  }
};

const linkHandler = (e) => {
  e.preventDefault();
  const url = e.target.getAttribute('href');
  const destOffsetTop = document.querySelector(url).offsetTop;
  menu.classList.remove('menu--open');
  scroll({
    top: destOffsetTop - 70,
    behavior: 'smooth',
  });
};

menu_button.addEventListener('click', menuHandler);

menu_links.forEach((menu_link) => menu_link.addEventListener('click', (e) => menuLinkHandler(e)));

links.forEach((link) => link.addEventListener('click', (e) => linkHandler(e)));

window.addEventListener('DOMContentLoaded', () => {
  setOffsetOfElements([...section_images, ...section_descriptions]);
  setObserverThreshold();
  createNewScrollObserver(observer_threshold);
});
