import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function CheckoutModal() {
  const [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        Open Modal
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          {/* Darkened Background */}
          <div className="fixed inset-0 bg-black bg-opacity-80" />

          {/* Modal Centered on Screen */}
          <div className="fixed inset-0 flex items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full">
                <Dialog.Title className="text-lg font-semibold text-gray-900">
                  Floating Modal
                </Dialog.Title>
                <p className="mt-2 text-gray-600">This modal floats in the center.</p>
                <button
                  onClick={closeModal}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
