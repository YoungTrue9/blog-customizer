import { useEffect } from 'react';

type TUseClose = {
	isMenuOpen: boolean;
	onClose: () => void;
	rootRef: React.RefObject<HTMLFormElement>;
};
// в кастом хуке мы ставим в начале use чтобы React понимал что это кастомный хук, 
// лично этот нужен для того чтобы при 1-нажатие на "ESC" меню закрывалось и 2-при нажатие ВНЕ меню , закрытие происходило по нажатию на экран
export function useClose({ isMenuOpen, onClose, rootRef }: TUseClose) {
	useEffect(() => {
		if (!isMenuOpen) return; // останавливаем действие эффекта, если закрыто меню

		function handleClickOutside(event: MouseEvent) {
			const { target } = event;
			const isOutsideClick =
				target instanceof Node && // проверяем, что это `DOM`-элемент
				rootRef.current &&
				!rootRef.current.contains(target); // если кликнуто вне нашего меню, то тоже закрываем меню, это второй пункт нашего условия.
			if (isOutsideClick) {
				onClose();
			}
		}
        // если юзер нажал на кнопку "ESC" , то нужног закрыть меню. Это первый пункт нашего условия.
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose();
			}
		};
        document.addEventListener('mousedown', handleClickOutside); // вешаем прослушку чтобы узнать кликнул ли юзер
		document.addEventListener('keydown', handleEscape); // вешаем прослушку чтобы узнать нажал ли пользователь на кнопку

		return () => {
			document.removeEventListener('keydown', handleEscape);
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, 
    [isMenuOpen, onClose, rootRef]);
}
