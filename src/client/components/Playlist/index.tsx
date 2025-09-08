import { PlaylistProps } from './index.props'
import React, { KeyboardEvent, useEffect, useState } from 'react'
import { Track } from '../Track'
import { Text } from '../Text'
import classNames from 'classnames'
import styles from './index.module.css'
import { Input } from '../Input'
import { useActions } from 'client/hooks/useActions'
import { Button } from '../Button'

export const PlaylistComponent: React.FC<PlaylistProps> = ({
  playlist,
  ...props
}): JSX.Element => {
  const { bind, isCaching, tracks, playlistId, playlistName, error } = playlist
  const { setBind, fetchPlaylistTracks, removePlaylist } = useActions()
  const [stateBind, setStateBind] = useState(bind)
  const [toDisplayTracks, setToDisplayTracks] = useState(tracks.sort((a, b) => a.added_at.localeCompare(b.added_at)).slice(-5).reverse())

  const onRemovePlaylist = () => {
    removePlaylist(playlistId)
  }

  const onBindChange = (event: KeyboardEvent<HTMLInputElement>) => {
    const key = event.key.toUpperCase()
    const ctrl = event.ctrlKey ? 'Control+' : ''
    const alt = event.altKey ? 'Alt+' : ''
    const shift = event.shiftKey ? 'Shift+' : ''
    const meta = event.metaKey ? 'Meta+' : ''

    if (['CONTROL', 'ALT', 'SHIFT', 'META'].includes(key)) return

    const isAscii = key.split('').every(char => char.charCodeAt(0) <= 127)
    if (!isAscii) return

    const finalBind = `${shift}${alt}${ctrl}${meta}${key}`

    setStateBind(finalBind)
    setBind(playlistId, finalBind)
  }

  useEffect(() => {
    if (!tracks.length) {
      fetchPlaylistTracks(playlistId)
    }
  }, [])

  useEffect(() => {
    setToDisplayTracks(tracks.slice(-5).reverse())
  }, [tracks.length])


  const playlistImage = playlist.playlistImages[0]?.url || toDisplayTracks[0]?.img

  return (
    <div className={classNames(styles.container)}>
      <div className={classNames(styles.playlistCard)} {...props}>
        {error && (
          <Text type='h5' className={classNames(styles.errorText)}>
            {error}
          </Text>
        )}
        <div className={classNames(styles.playlistCardHeader)}>
          <img
            src={playlistImage}
            className={classNames({
              [styles.playlistCardHeaderImage]: playlistImage,
              [styles.hideImage]: !playlistImage,
              [styles.removeBorderRadius]: error,
            })}
          />

          <Text className={classNames(styles.text, styles.center, styles.spacing)} type='h3'>
            {playlistName}
            {
              playlist.isSpotifyGeneratePlaylist ? <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><path fill='currentColor' d='m12.225 12.5l2.275-1.375l2.275 1.375l-.6-2.6l2-1.725l-2.625-.225L14.5 5.5l-1.05 2.45l-2.625.225l2 1.725zM12.7 19h5.6q-.175.65-.6 1.05t-1.1.5L5.7 21.875q-.825.125-1.488-.387T3.45 20.15L2.125 9.225q-.1-.825.4-1.475T3.85 7L5 6.85v2l-.9.125L5.45 19.9zM9 17q-.825 0-1.412-.587T7 15V4q0-.825.588-1.412T9 2h11q.825 0 1.413.588T22 4v11q0 .825-.587 1.413T20 17zm0-2h11V4H9zm-3.55 4.9'/></svg> : ''
            }
          </Text>
          <svg
            className={classNames(styles.removeButton)}
            onClick={onRemovePlaylist}
            viewBox='0 0 512 512'
          >
            <path d='M0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256zM175 208.1L222.1 255.1L175 303C165.7 312.4 165.7 327.6 175 336.1C184.4 346.3 199.6 346.3 208.1 336.1L255.1 289.9L303 336.1C312.4 346.3 327.6 346.3 336.1 336.1C346.3 327.6 346.3 312.4 336.1 303L289.9 255.1L336.1 208.1C346.3 199.6 346.3 184.4 336.1 175C327.6 165.7 312.4 165.7 303 175L255.1 222.1L208.1 175C199.6 165.7 184.4 165.7 175 175C165.7 184.4 165.7 199.6 175 208.1V208.1z' />
          </svg>
          <Input
            placeholder='Bind'
            value={stateBind}
            onChange={() => {}}
            onKeyDownCapture={onBindChange}
            className={classNames(styles.bindInput)}
          />
        </div>
        <div className={classNames(styles.playlistCardBody)}>
           <div className={classNames(styles.center)}>
            {isCaching ? (
              <Text type='h5' className={classNames(styles.statusText)}>CACHING...</Text>
            ) : toDisplayTracks.length ? (
              <div className={classNames(styles.tracksList)}>
                <Text type='h5' className={classNames(styles.tracksHeader)}>Recent tracks:</Text>
                {toDisplayTracks.map((track, idx) => (
                  <div key={idx} className={classNames(styles.compactTrack)}>
                    <img
                      src={track.img}
                      className={classNames(styles.smallTrackImage)}
                      onClick={() => window.api.utils.openInBrowser(track.img)}
                      title='Click to view image'
                    />
                    <div className={classNames(styles.trackInfo)}>
                      <Text type='h6' className={classNames(styles.trackArtist)}>
                        {track.artists.slice(0, 35)}
                      </Text>
                      <Text type='h6' className={classNames(styles.trackName)}>
                        {track.name.slice(0, 40)}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <Text type='h1' className={classNames(styles.statusText)}>Playlist is empty</Text>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
