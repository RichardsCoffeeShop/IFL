import React, { useEffect } from 'react'
import styles from './index.module.css'
import classNames from 'classnames'
import { useTypedSelector } from 'client/hooks/useTypedSelector'
import { useActions } from 'client/hooks/useActions'

export const Navbar = ({}): JSX.Element => {
  const {
    user: { accessToken },
    app: { isUpdateLive },
  } = useTypedSelector(state => state)
  const {
    setUpdateLive,
    setUpdateOffline,
    logoutUser,
    setAddingNewPlaylist,
    fetchPlaylists,
  } = useActions()
  const { selectedPlaylists } = useTypedSelector(state => state.user)

  useEffect(() => {
    window.api.receive('update-available', () => {
      setUpdateLive()
    })
  }, [])

  const onHide = () => {
    window.api.send('hide-window', '')
  }
  const onHideToTray = () => {
    window.api.send('hide-window-to-tray', '')
  }
  const onUpdate = () => {
    window.api.send('need-to-update', '')
    setUpdateOffline()
  }
  const onLogout = () => {
    logoutUser()
  }
  const onPlaylistAdd = () => {
    setAddingNewPlaylist()
    fetchPlaylists()
  }

  return (
    <div className={classNames(styles.main)}>
      <div className={classNames(styles.nav, styles.drag)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', placeContent: 'space-between', width: '100%' }}>

        <div className={classNames(styles.row)}>
          <img src={'static://icons/app.png'} alt='App Icon' className={classNames(styles.logo)} />
          <div className={classNames(styles.text)}>
            <p>IFL</p>
          </div>
        </div>

        <div className={classNames(styles.row)}>

        {selectedPlaylists.length ? (
          <div className={classNames(styles.buttonSelect, styles.noDrag)} onClick={onPlaylistAdd}>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='none' stroke='#928BFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M11 17a3 3 0 1 0 6 0a3 3 0 1 0-6 0m6 0V4h4m-8 1H3m0 4h10m-4 4H3'/></svg>
            <div className={classNames(styles.text)}>
              <p>Playlists</p>
            </div>
          </div>
        ) : null}

        {accessToken ? (
          <div className={classNames(styles.buttonSelect, styles.noDrag)} onClick={onLogout}>
            <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='none' stroke='#928BFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M16 4h3a2 2 0 0 1 2 2v1m-5 13h3a2 2 0 0 0 2-2v-1M4.425 19.428l6 1.8A2 2 0 0 0 13 19.312V4.688a2 2 0 0 0-2.575-1.916l-6 1.8A2 2 0 0 0 3 6.488v11.024a2 2 0 0 0 1.425 1.916M16.001 12h5m0 0l-2-2m2 2l-2 2'/></svg>
            <div className={classNames(styles.text)}>
              <p>Log out</p>
            </div>
          </div>
        ) : null}
          

        {isUpdateLive ? (
          <svg
            onClick={onUpdate}
            className={classNames(styles.update, styles.noDrag)}
            viewBox='0 0 384 512'
          >
            <path
              fill='#00ff08'
              d='M374.6 310.6l-160 160C208.4 476.9 200.2 480 192 480s-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 370.8V64c0-17.69 14.33-31.1 31.1-31.1S224 46.31 224 64v306.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0S387.1 298.1 374.6 310.6z'
            />
          </svg>
        ) : null}
        </div>

          <div className={classNames(styles.row)}>
            <div className={classNames(styles.buttonSelect, styles.noDrag)} onClick={onHide}>
              <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 16 16'><path fill='white' fill-rule='evenodd' d='M13 8.5H3v-1h10z' clip-rule='evenodd'/></svg>
            </div>
            <div className={classNames(styles.buttonSelect, styles.noDrag)} onClick={onHideToTray}>
              <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'><path fill='white' d='m8.401 16.333l-.734-.727L11.266 12L7.667 8.42l.734-.728L12 11.29l3.574-3.597l.734.727L12.709 12l3.599 3.606l-.734.727L12 12.737z'/></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
