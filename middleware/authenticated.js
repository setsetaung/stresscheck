import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../plugins/firebase'

export default function ({ store }) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      store.dispatch('setUser', {
        uid: user.uid,
        displayName: user.displayName
      })
    }
  })
}
