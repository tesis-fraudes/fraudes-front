import api from "../lib/axios"
import { adaptModelsApiResponse } from "./model.adapter"

export interface SaveModelPayload {
  file: File | Blob
  modelo: string
  version: string
  accuracy: string,
  status: string
}

export async function saveModel({ file, modelo, version, accuracy, status }: SaveModelPayload) {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("modelo", modelo)
  formData.append("version", version)
  formData.append("accuracy", accuracy)
  formData.append("status", status )
  const response = await api.post("/neural-network/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "accept": "*/*",
    },
  })
  return response.data
}

export async function getModels() {
  try {
    const response = await api.get("/neural-network", {
      headers: {
        "accept": "*/*",
      },
    })
    return adaptModelsApiResponse(response.data)
  } catch (error) {
    console.error("Error al obtener modelos:", error)
    return []
  }
}

export async function getModelById(id: string | number) {
  const response = await api.get(`/neural-network/${id}`, {
    headers: {
      "accept": "*/*",
    },
  })
  return response.data
} 