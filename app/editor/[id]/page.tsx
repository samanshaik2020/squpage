import { CarrdEditor } from "@/components/editor/carrd-editor"

interface EditorPageProps {
  params: {
    id: string
  }
}

export default function EditorPage({ params }: EditorPageProps) {
  return <CarrdEditor templateId={params.id} />
}
