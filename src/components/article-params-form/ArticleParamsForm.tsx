import { Button } from 'components/button';
import { ArrowButton } from 'components/arrow-button';
import { Text } from '../text';
import { FormEvent, useRef, useState } from 'react';
import { Select } from '../select';
import { ArticleStateType, backgroundColors, contentWidthArr, defaultArticleState, fontColors, fontFamilyOptions, fontSizeOptions } 
from 'src/constants/articleProps';
import { RadioGroup } from '../radio-group';
import { useOutsideClickClose } from '../select/hooks/useOutsideClickClose';
import { Separator } from '../separator';
import { useClose } from './hooks/useClose';
import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';

interface ArticleParamsFormProps {
	articleState: ArticleStateType;
	setArticleState: (param: ArticleStateType) => void;
}

export const ArticleParamsForm = ({
	articleState,
	setArticleState,
}: ArticleParamsFormProps) => {
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); 
	const [formState, setFormState] = useState({ // это наши данные CSS состояние которые будут изменяться, сейчас это сток контент
		fontFamily: articleState.fontFamilyOption, // Шрифты
		fontSize: articleState.fontSizeOption, // Размер текста
		fontColor: articleState.fontColor, // Цвет текста
		backgroundColor: articleState.backgroundColor, // Цвет фона
		contentWidth: articleState.contentWidth, // размер контейнера
	});

	const rootRef = useRef<HTMLElement | null>(null);
	const formRef = useRef<HTMLFormElement>(null);
    
	useOutsideClickClose({
		isMenuOpen,
		rootRef,
		onClose: () => setIsMenuOpen(false),
		onChange: setIsMenuOpen,
	});

	useClose({
		isMenuOpen: isMenuOpen,
		onClose: () => setIsMenuOpen(false),
		rootRef: formRef,
	});


    // если мы нажем на кнопку изменить параметры, то сможем поменять CSS структуру проекта
	const formSubmitHandler = (evt: FormEvent) => {
		evt.preventDefault();

		setArticleState({
			...formState,
			fontFamilyOption: formState.fontFamily,
			fontSizeOption: formState.fontSize,
			fontColor: formState.fontColor,
			backgroundColor: formState.backgroundColor,
			contentWidth: formState.contentWidth,
		});

		setIsMenuOpen(!isMenuOpen);
	};

    // если мы нажем на кнопку восстановить параметры, то сток CSS контейнер подгрузит стоковые состояния
    const formResetHandler = () => {
		setFormState((prevState) => ({ 
			...prevState,
			fontFamily: defaultArticleState.fontFamilyOption,
			fontSize: defaultArticleState.fontSizeOption,
			fontColor: defaultArticleState.fontColor,
			backgroundColor: defaultArticleState.backgroundColor,
			contentWidth: defaultArticleState.contentWidth,
		}));

		setArticleState(defaultArticleState);
	};

	return (
        // это форма в которой мы изменяем стиль нашего контента
		<>
			<ArrowButton onClick={setIsMenuOpen} isMenuOpen={isMenuOpen} />
			<aside
				className={clsx(styles.container, isMenuOpen && styles.container_open)}
				ref={rootRef}>
				<form
					className={styles.form}
					onSubmit={formSubmitHandler} // изменение состояние
					onReset={formResetHandler} // сток состояние
					ref={formRef}>
					<Text as={'h2'} size={31} weight={800} uppercase={true}>
						Задайте параметры
					</Text>
					<Select
						title='Шрифт'

						selected={formState.fontFamily}

						options={fontFamilyOptions}

						onChange={(selectedOption) =>
							setFormState((prevState) => ({ // при выборе шрифта меняем fontFamily в state
								...prevState,
								fontFamily: selectedOption,
							}))
						}
					/>
					<RadioGroup
						options={fontSizeOptions}

						selected={formState.fontSize}

						title='Размер шрифта'

						name='Размер шрифта'

						onChange={(selectedOption) =>
							setFormState((prevState) => ({ // при выборе шрифта меняем fontSize в state
								...prevState,
								fontSize: selectedOption,
							}))
						}
					/>
					<Select
						options={fontColors}

						selected={formState.fontColor}

						title='Цвет шрифта'

						onChange={(selectedOption) =>
							setFormState((prevState) => ({ // при выборе шрифта меняем fontColor в state
								...prevState,
								fontColor: selectedOption,
							}))
						}
					/>
					<Separator />
					<Select
						options={backgroundColors}

						selected={formState.backgroundColor}

						title='Цвет фона'

						onChange={(selectedOption) =>
							setFormState((prevState) => ({ // при выборе шрифта меняем backgroundColor в state
								...prevState,
								backgroundColor: selectedOption,
							}))
						}
					/>
					<Select
						options={contentWidthArr}

						selected={formState.contentWidth}

						title='Ширина контента'

						onChange={(selectedOption) =>
							setFormState((prevState) => ({ // при выборе шрифта меняем contentWidth в state
								...prevState,
								contentWidth: selectedOption,
							}))
						}
					/>
					<div className={styles.bottomContainer}> 
						<Button title='Сбросить' type='reset' />
						<Button title='Применить' type='submit' />
					</div>
				</form>
			</aside>
		</>
	);
};
