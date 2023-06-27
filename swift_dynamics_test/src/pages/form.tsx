import React from 'react'
import { useTranslation } from 'react-i18next';

function Form() {
    const { t } = useTranslation();
    return (
        <div>{t('form')}</div>
    )
}

export default Form