export default function ProfileModal({ isOpen, onClose, profileData }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()} // Empêche la fermeture en cliquant dedans
      >
        <h2 className="text-xl font-bold mb-4">Mon Profil</h2>
        <p><strong>Nom complet :</strong> {profileData.displayName || profileData.name}</p>
        <p><strong>Email :</strong> {profileData.email}</p>
        <p><strong>Matricule :</strong> {profileData.matricule}</p>
        <p><strong>Département :</strong> {profileData.departement}</p>
        <p><strong>Niveau :</strong> {profileData.niveau}</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}
