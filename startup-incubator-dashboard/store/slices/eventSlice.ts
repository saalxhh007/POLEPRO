import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: null,
  title: '',
  type: '',
  description: '',
  date: '',
  time: '',
  location: '',
  capacity: null,
  tags: '',
  fiche: '',
  fiche_title: '',
  fiche_alternatif: '',
  supp: ''
}

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvent: (state, action) => {
      const {
        id,
        title,
        type,
        description,
        date,
        time,
        location,
        capacity,
        tags,
        fiche,
        fiche_title,
        fiche_alternatif,
        supp
      } = action.payload
      
      state.id = id
      state.title = title
      state.type = type
      state.description = description
      state.date = date
      state.time = time
      state.location = location
      state.capacity = capacity
      state.tags = tags
      state.fiche = fiche
      state.fiche_title = fiche_title
      state.fiche_alternatif = fiche_alternatif
      state.supp = supp
    }
  }
})

export const { setEvent } = eventSlice.actions
export default eventSlice.reducer
