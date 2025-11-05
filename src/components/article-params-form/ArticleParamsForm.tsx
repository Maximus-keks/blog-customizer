import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text/Text';

import {
	fontFamilyOptions,
	fontSizeOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	ArticleStateType,
	defaultArticleState,
	OptionType,
} from 'src/constants/articleProps';

import { useState, useRef } from 'react';
import { useCloseOnOutsideClickOrEsc } from 'src/ui/select/hooks/useCloseOnOutsideClickOrEsc';

import styles from './ArticleParamsForm.module.scss';
import clsx from 'clsx';

// Типизация пропсов компонента
type ArticleParamsFormProps = {
	currentState: ArticleStateType; //текущие настройки статьи (для отображения при открытии)
	setArticleState: (props: ArticleStateType) => void; //колбэк для передачи обновлённых настроек родителю
};

export const ArticleParamsForm = ({
	currentState,
	setArticleState,
}: ArticleParamsFormProps) => {
	const asideRef = useRef<HTMLElement>(null); //создаём ссылку на DOM-элемент <aside> для отслеживания кликов вне сайдбара
	const [isFormOpen, setIsFormOpen] = useState(false); //состояние видимости сайдбара: false — закрыт, true — открыт
	const [settingsState, setSettingsState] =
		useState<ArticleStateType>(defaultArticleState); //локальное состояние формы, которое хранит выбранные пользователем настройки до нажатия "Применить"

	// Обработчик переключения видимости сайдбара
	const handleToggle = () => {
		if (!isFormOpen) {
			setSettingsState(currentState); //при открытии копируем актуальные настройки в локальное состояние
		}
		setIsFormOpen(!isFormOpen);
	};

	// Кастомный хук, который закрывает сайдбар при клике вне его области или на Esc
	useCloseOnOutsideClickOrEsc({
		isOpenElement: isFormOpen,
		onClose: () => setIsFormOpen(false),
		elementRef: asideRef,
	});

	// Обработчик изменений полей в форме
	const handleChange =
		(field: keyof ArticleStateType) => (value: OptionType) => {
			setSettingsState((prev) => ({ ...prev, [field]: value }));
		};

	// Обработчик отправки формы
	const handleSubmit = (evt: React.FormEvent) => {
		evt.preventDefault();
		setArticleState(settingsState);
		setIsFormOpen(false);
	};

	// Сброс настроек к значениям "по умолчанию"
	const handleReset = () => {
		setSettingsState(defaultArticleState);
		setArticleState(defaultArticleState);
	};

	return (
		<>
			<ArrowButton isOpen={isFormOpen} onClick={handleToggle} />
			<aside
				className={clsx(styles.container, {
					[styles.container_open]: isFormOpen,
				})}
				ref={asideRef}>
				<form
					className={styles.form}
					onSubmit={handleSubmit}
					onReset={handleReset}>
					<Text size={31} weight={800} uppercase={true} align={'left'}>
						задайте параметры
					</Text>
					<Select
						title={'Шрифт'}
						options={fontFamilyOptions}
						selected={settingsState.fontFamilyOption}
						onChange={handleChange('fontFamilyOption')}
					/>
					<RadioGroup
						name={'font-size'}
						title={'Размер шрифта'}
						options={fontSizeOptions}
						selected={settingsState.fontSizeOption}
						onChange={handleChange('fontSizeOption')}
					/>
					<Select
						title={'Цвет шрифта'}
						options={fontColors}
						selected={settingsState.fontColor}
						onChange={handleChange('fontColor')}
					/>
					<Separator />
					<Select
						title={'Цвет фона'}
						options={backgroundColors}
						selected={settingsState.backgroundColor}
						onChange={handleChange('backgroundColor')}
					/>
					<Select
						title={'Ширина контента'}
						options={contentWidthArr}
						selected={settingsState.contentWidth}
						onChange={handleChange('contentWidth')}
					/>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
