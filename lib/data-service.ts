import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

const USE_MOCK_DATA = false;

export type BookLoan = {
  id: string
  bookId: string
  studentId: string
  status: string
  dueDate?: string
}


export const dataService = {

  // 📚 LIBRARY (Books Catalog)
  async getBooksCatalog() {
    const snapshot = await getDocs(collection(db, "books"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async addBookToCatalog(bookData: { bookId: string; title: string; author: string }) {
    return await addDoc(collection(db, "books"), bookData);
  },

  // 📖 BOOK LOANS
  async getBookLoans(): Promise<BookLoan[]> {
    const snapshot = await getDocs(collection(db, "book_loans"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as BookLoan[];
  },


  async createBookLoan(loanData: {
    bookId: string;
    title: string;      // ✅ NUEVO
    author: string;     // ✅ NUEVO
    studentId: string;
    status: string;
    dueDate?: string;
  }) {
    return await addDoc(collection(db, "book_loans"), loanData);
  },

  async updateLoanStatus(loanId: string, status: string) {
    const loanRef = doc(db, "book_loans", loanId);
    await updateDoc(loanRef, { status });
  },

  async setLoanDueDate(loanId: string, dueDate: string) {
    const loanRef = doc(db, "book_loans", loanId);
    await updateDoc(loanRef, { dueDate });
  },

  async getStudentBookRequests(studentId: string) {   // ✅ NUEVO
    const snapshot = await getDocs(query(
      collection(db, "book_loans"),
      where("studentId", "==", studentId)
    ));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getBorrowedBooks(studentId: string) {
    const snapshot = await getDocs(query(
      collection(db, "book_loans"),
      where("studentId", "==", studentId),
      where("status", "==", "Active")
    ))
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getLoanHistory(studentId: string) {
    const snapshot = await getDocs(query(
      collection(db, "book_loans"),
      where("studentId", "==", studentId)
    ))
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async getPendingBookLoans() {
    const snapshot = await getDocs(query(
      collection(db, "book_loans"),
      where("status", "==", "Pending")
    ));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async approveBookLoanRequest(loanId: string, dueDate: string) {
    const loanRef = doc(db, "book_loans", loanId);
    await updateDoc(loanRef, {
      dueDate: dueDate,
      status: "On Time",
    });
  },

  async updateBookLoanStatus(loanId: string, status: string) {
    const loanRef = doc(db, "book_loans", loanId);
    await updateDoc(loanRef, { status });
  },

  // 🎓 STUDENTS
  async getStudents() {
    if (USE_MOCK_DATA) return [];
    const snapshot = await getDocs(collection(db, "students"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async addStudent(studentData: { id: string; name: string; email: string; status: string }) {
    const studentRef = doc(db, "students", studentData.id)  // Carnet como ID real del documento
    await setDoc(studentRef, studentData)
  },
  
  async updateStudent(studentId: string, updatedData: { name: string; email: string; status: string }) {
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, updatedData);
  },

  async deleteStudent(studentId: string) {
    const studentRef = doc(db, "students", studentId);
    await deleteDoc(studentRef);
  },


  // 🏫 STUDY ROOMS
  async requestStudyRoom(roomId: string, studentId: string) {
    const roomRef = doc(db, "study_rooms", roomId);
    await updateDoc(roomRef, {
      status: "Pending",
      requestedBy: studentId,
      requestedAt: new Date().toISOString(),
    });
  },

  async addStudyRoom(roomData: { name: string; status: string; occupiedBy: string | null; occupiedUntil: string | null }) {
    return await addDoc(collection(db, "study_rooms"), roomData)
  },

  async getStudyRooms() {
    const snapshot = await getDocs(collection(db, "study_rooms"))
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),  
    }))
  },


  async getStudentRoomRequest(studentId: string) {
    const snapshot = await getDocs(query(
      collection(db, "study_rooms"),
      where("requestedBy", "==", studentId)
    ));

    const pendingRequests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const occupiedSnapshot = await getDocs(query(
      collection(db, "study_rooms"),
      where("occupiedBy", "==", studentId)
    ));

    const occupiedRooms = occupiedSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return [...pendingRequests, ...occupiedRooms];
  },

  async approveStudyRoomRequest(roomId: string, studentId: string, occupiedUntil: string) {
    const roomRef = doc(db, "study_rooms", roomId)
    await updateDoc(roomRef, {
      status: "Occupied",
      occupiedBy: studentId,      // Aquí asignas automáticamente el requestedBy como encargado
      requestedBy: null,          // Limpias la solicitud
      occupiedUntil: occupiedUntil,
    })
  },

  async setOccupiedUntil(roomId: string, occupiedUntil: string) {
    const roomRef = doc(db, "study_rooms", roomId)
    await updateDoc(roomRef, { occupiedUntil })
  },

  async rejectStudyRoomRequest(roomId: string) {
    const roomRef = doc(db, "study_rooms", roomId);
    await updateDoc(roomRef, {
      status: "Available",
      requestedBy: null,
      requestedAt: null,
    });
  },

  async updateRoomStatus(roomId: string, status: string, occupiedBy?: string, occupiedUntil?: string) {
    const roomRef = doc(db, "study_rooms", roomId);
    await updateDoc(roomRef, {
      status,
      occupiedBy: occupiedBy || null,
      occupiedUntil: occupiedUntil || null,
    });
  },

  // 💵 FINES
  async getFines(studentId?: string) {
    let finesQuery;
    if (studentId) {
      finesQuery = query(collection(db, "fines"), where("studentId", "==", studentId));
    } else {
      finesQuery = collection(db, "fines");
    }
    const snapshot = await getDocs(finesQuery);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async markFinePaid(fineId: string) {
    const fineRef = doc(db, "fines", fineId);
    await updateDoc(fineRef, { status: "Paid" });
  },

  // 📝 ACTIVITY LOGS
  async getActivityLogs() {
    const snapshot = await getDocs(collection(db, "activity_logs"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

};
