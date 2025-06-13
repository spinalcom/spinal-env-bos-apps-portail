import { Directive } from "vue";

export const OverflowDirective: Directive = {

        bind(el: HTMLElement): void {
            const tooltip = document.createElement('span');
            tooltip.className = 'tooltip';
            tooltip.innerText = el.innerText;
            el.style.position = 'relative';
            el.dataset.tooltipCreated = 'false';


            function checkOverflow() {
                console.log('checkOverflow', el.scrollWidth, el.clientWidth);
                if(el.scrollWidth > el.clientWidth) {
                    el.appendChild(tooltip);
                    el.dataset.tooltipCreated = 'true';

                } else if(el.dataset.tooltipCreated === 'true') {
                    el.removeChild(tooltip);
                    el.dataset.tooltipCreated = 'false';
                }
            }


            el.addEventListener('mouseenter',  () => checkOverflow());

            el.addEventListener('mouseleave', () => {
                console.log('mouseleave');
                if(el.dataset.tooltipCreated === 'true') {
                    el.removeChild(tooltip);
                    el.dataset.tooltipCreated = 'false'
                }
                
            });
        },
};