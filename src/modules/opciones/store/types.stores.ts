import { IFacultad, ITipoSolicitud, IIdioma, IEscuela } from '@/modules/opciones/interfaces/types.interface'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface EscuelaState {
    escuelas: IEscuela[]
    setEscuelas: (docs:IEscuela[]) => void
}

export const useEscuelasStore = create<EscuelaState>()(
    persist(
        (set) => ({
        escuelas: [],
        setEscuelas: (docs) => set({ escuelas: docs }),//set({ bears: get().bears + 1 }),
        }),
        {
        name: 'escuelas-storage', // name of item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
        partialize: (state) => ({ escuelas: state.escuelas }),
        },
    ),
)

interface DocsState {
  documents: ITipoSolicitud[]
  setDocuments: (docs:ITipoSolicitud[]) => void
}

export const useDocumentsStore = create<DocsState>()(
	persist(
		(set) => ({
		documents: [],
		setDocuments: (docs) => set({ documents: docs }),//set({ bears: get().bears + 1 }),
		}),
		{
		name: 'documents-storage', // name of item in the storage (must be unique)
		storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
		partialize: (state) => ({ documents: state.documents }),
		},
	),
)

interface FacusState {
    faculties: IFacultad[]
    setFaculties: (docs:IFacultad[]) => void
  }
  
  export const useFacultiesStore = create<FacusState>()(
    persist(
      (set) => ({
        faculties: [],
        setFaculties: (facus) => set({ faculties: facus }),//set({ bears: get().bears + 1 }),
      }),
      {
        name: 'faculties-storage', // name of item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
        partialize: (state) => ({ documents: state.faculties }),
      },
    ),
)
interface SubjectsState {
    subjects: IIdioma[]
    setSubjects: (subs:IIdioma[]) => void
}
  
  export const useSubjectsStore = create<SubjectsState>()(
    persist(
      (set) => ({
        subjects: [],
        setSubjects: (subs) => set({ subjects: subs }),
      }),
      {
        name: 'faculties-storage', // name of item in the storage (must be unique)
        storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
        partialize: (state) => ({ documents: state.subjects }),
      },
    ),
)