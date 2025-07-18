import { addDoc, collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "./firebase";

const USE_MOCK_DATA = false;

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
  async getBookLoans() {
    const snapshot = await getDocs(collection(db, "book_loans"));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  },

  async createBookLoan(loanData: { bookId: string; studentId: string; status: string; dueDate?: string }) {
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

  // 🎓 STUDENTS
  async getStudents() {
    if (USE_MOCK_DATA) return [];
    const snapshot = await getDocs(collection(db, "students"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async addStudent(studentData: { id: string; name: string; email: string; status: string }) {
    const studentRef = doc(db, "students", studentData.id);  // El carnet como ID real del documento
    await setDoc(studentRef, studentData);
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
  async getStudyRooms() {
    const snapshot = await getDocs(collection(db, "study_rooms"));
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  },

  async updateRoomStatus(roomId: string, status: string, occupiedBy?: string) {
    const roomRef = doc(db, "study_rooms", roomId);
    await updateDoc(roomRef, {
      status,
      occupiedBy: occupiedBy || null,
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
