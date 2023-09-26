import { IconButton, Menu, MenuItem } from '@mui/material'
import TranslateIcon from '@mui/icons-material/Translate'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '../../utils'
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [selectorOpen, setSelectorOpen] = React.useState(false)
  const [anchorEl, setAnchorEl] = React.useState(null)
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
    setSelectorOpen(!selectorOpen)
  }
  const handleClose = (e) => {
    setAnchorEl(null)
    setSelectorOpen(false)
  }
  const handleSelect = (selected) => {
    i18n.changeLanguage(selected)
    handleClose()
  }
  return (
    <div>
      <IconButton
        sx={{ color: 'white' }}
        id="language-button"
        aria-label="Change Language"
        onClick={handleClick}
      >
        <TranslateIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={selectorOpen}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-button',
        }}
      >
        {languages.map((l) => {
          return (
            <MenuItem key={l} onClick={() => handleSelect(l)}>
              {t(`languages.${l}`)}
            </MenuItem>
          )
        })}
      </Menu>
    </div>
  )
}
