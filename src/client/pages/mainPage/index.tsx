import classNames from 'classnames'
import { useActions } from 'client/hooks/useActions'
import { useTypedSelector } from 'client/hooks/useTypedSelector'
import React, { ChangeEvent, useEffect, useState } from 'react'
import MainPageProps from './index.props'
import styles from './index.module.css'
import { Button } from 'client/components/Button'
import { Text } from 'client/components/Text'
import { Playlist } from 'shared/types/user'
import { PlaylistComponent } from 'client/components/Playlist'
import { Modal } from 'client/components/Modal'

const MainPage: React.FC<MainPageProps> = ({}: MainPageProps) => {
  const { playlists, selectedPlaylists, isAddingNewPlaylist } =
    useTypedSelector(state => state.user)
  const { setSelectedPlaylist, fetchPlaylists, setBind, setAddingNewPlaylist } =
    useActions()

  const [filteredPlaylists, setFilteredPlaylists] = useState([])
  const [displayModal, setDisplayModal] = useState(false)

  const onPlaylistSelect = (playlist: Playlist) => {
    if (
      playlist.id === 'Select playlist' ||
      selectedPlaylists.find(({ playlistId }) => playlistId === playlist.id)
    )
      return

    onEditPlaylistId(playlist)

    if (isAddingNewPlaylist) setAddingNewPlaylist()
  }

  const onRefreshPlaylist = () => fetchPlaylists()
  const onEditPlaylistId = (playlist: Playlist) => {
    setSelectedPlaylist(playlist)
  }
  const onModalOpen = () => {
    fetchPlaylists()

    setDisplayModal(true)
  }

  useEffect(() => {
    const playlists = localStorage.getItem('playlists-binds-json')
    const parsed: { [key: string]: { name: string; bind: string, images: { url: string }[] } } = JSON.parse(playlists) ?? {}

    for (const [id, data] of Object.entries(parsed)) {
      if (!data.name || !data.bind) continue

      setSelectedPlaylist({
        id,
        name: data.name,
        images: data.images,
      })

      if (data.bind) setBind(id, data.bind)
    }
  }, [])

  useEffect(() => {
    if (!isAddingNewPlaylist) return

    setDisplayModal(true)
    fetchPlaylists()
  }, [isAddingNewPlaylist])

  useEffect(() => {
    const filteredPlaylists = playlists.reduce((acc, curr) => {
      if (selectedPlaylists.find(el => el.playlistName === curr.name))
        return acc

      acc.push(curr)

      return acc
    }, [])

    if (filteredPlaylists.length) setFilteredPlaylists(filteredPlaylists)
  }, [selectedPlaylists.length, playlists.length])

  return (
    <div className={classNames(styles.mainPage)}>
      {selectedPlaylists.length && !isAddingNewPlaylist ? (
        <div className={styles.main}>
          {selectedPlaylists.map((playlist, idx) => {
            return <PlaylistComponent playlist={playlist} key={idx} />
          })}
        </div>
      ) : (
        <div className={classNames(styles.noPlaylists)}>
          {displayModal || isAddingNewPlaylist ? (
            <Modal
              setDisplayModal={setDisplayModal}
              displayModal={displayModal}
              displayRefreshButton={true}
              isAddingNewPlaylist={isAddingNewPlaylist}
              refreshPlaylists={onRefreshPlaylist}
            >
              <div className={classNames(styles.modalHeader)}>
                <Text type='h1' className={classNames(styles.text)}>
                  Your playlists
                </Text>
              </div>
              <div className={classNames(styles.modalBody)}>
                {filteredPlaylists.length ? (
                  <div className={classNames(styles.playlists)}>
                    {filteredPlaylists.slice(0, 50).map((playlist, idx) => {
                      return (
                        <div
                          key={idx}
                          className={classNames(styles.playlistCard, styles.column)}
                             onClick={() =>
                              onPlaylistSelect(playlist)
                            }
                        >
                          <div className={classNames(styles.row)}>

                            <img className={classNames(styles.playlistSearchPreview)} src={playlist.images[0]?.url} alt={playlist.name} />
                            <p>{playlist.name}</p>
                          </div>
                          <Button className={classNames(styles.playlistSelectButton)}>
                            Add Bind
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <Text type='h1' className={classNames(styles.text)}>
                    Please create at least one playlist
                  </Text>
                )}
              </div>
            </Modal>
          ) : (
            <>
              <Button onClick={onModalOpen}>
                Select at least one playlist
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MainPage
