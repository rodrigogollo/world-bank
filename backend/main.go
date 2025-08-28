package main

import (
	"log"
	"net/http"
	"encoding/json"
)

type APIResponse struct {
    Status  string      `json:"status"`
    Message string      `json:"message,omitempty"`
    Data    interface{} `json:"data,omitempty"`
}

func main() {
	http.HandleFunc("/api/hello", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)	

		response := APIResponse{
			Status: "success",
			Data: "teste",
		}

		json.NewEncoder(w).Encode(response)
		// fmt.Fprintf(w, "Hello from the Go API!")
	})

	log.Println("Go API server started on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
