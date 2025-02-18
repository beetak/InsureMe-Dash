import Modal from "../../modal/Modal"
import { RingLoader } from "react-spinners"

export default function UserLoadingModal({ loading, message, setModal }) {
    console.log("message", message)
  const getModal = (isOpen) => {
    setModal(isOpen)
  }

  const renderContent = () => {
    if (loading&&!message) {
      return (
        <div className="flex flex-col w-80 justify-center items-center h-40">
          <RingLoader
            color={"#000"}
            loading={loading}
            cssOverride={override}
            size={100}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      )
    }

    if (!message || !message.status) {
      return <p>No data available</p>
    }

    const userData = message?.data

    return (
      <>
        <div className="sm:col-span-3 flex items-center">
          <div className="flex w-24">Firstname:</div>
          <div className="flex-1">{userData?.firstName || "N/A"}</div>
        </div>
        <div className="sm:col-span-3 flex items-center">
          <div className="flex w-24">Surname:</div>
          <div className="flex-1">{userData?.lastName || "N/A"}</div>
        </div>
        {message.region && (
          <div className="sm:col-span-3 flex items-center">
            <div className="flex w-24">Region:</div>
            <div className="flex-1">{message.region}</div>
          </div>
        )}
        {message.town && (
          <div className="sm:col-span-3 flex items-center">
            <div className="flex w-24">Town:</div>
            <div className="flex-1">{message.town}</div>
          </div>
        )}
        {message.shop && (
          <div className="sm:col-span-3 flex items-center">
            <div className="flex w-24">Shop:</div>
            <div className="flex-1">{message.shop.shopName}</div>
          </div>
        )}
      </>
    )
  }

  return (
    <Modal setModal={getModal}>
      <div className="block border border-gray-200 p-8 mt-3 rounded-sm">
        <h2 className="text-lg font-semibold">User Creation Status</h2>
        <p className="text-xs mb-4">{loading && !message.status ? "Please wait" : ""}</p>
        {message.status && message.code==="User Creation Successful" && (
            <div className="flex border-b border-gray-500">
                <div className="flex flex-col justify-center items-center w-1/2 my-3">
                    <img
                    src="https://static-00.iconduck.com/assets.00/user-icon-2048x2048-ihoxz4vq.png"
                    alt="User icon"
                    className="w-44"
                    />
                </div>
                <div className="space-y-1 text-blue-500 border-l p-3 border-gray-500">{renderContent()}</div>
            </div>
        )}
        {message.status && message.code ==="User Creation Failed" && (
          <div className="flex flex-col mt-3 items-center text-gray-600">
            <h1 className="text-sm">
              <span className="font-semibold text-red-600 text-7xl">Failed</span>
            </h1>
            {/* <h1 className='text-sm'>
              <span className='font-semibold'>Domain Name: </span>
              {message.data?.email || 'N/A'}
            </h1> */}
          </div>
        )}
      </div>
    </Modal>
  )
}

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "blue",
}

