import json
import hashlib
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.blockchain_model import BlockchainBlock

def calculate_block_hash(index: int, timestamp: datetime, action: str, data_str: str, previous_hash: str) -> str:
    """Calculates SHA256 hash of a block's contents."""
    block_string = f"{index}-{timestamp.isoformat() if hasattr(timestamp, 'isoformat') else str(timestamp)}-{action}-{data_str}-{previous_hash}"
    return hashlib.sha256(block_string.encode('utf-8')).hexdigest()

def add_block_to_ledger(db: Session, action: str, data: dict) -> BlockchainBlock:
    """Appends a new block to the blockchain database. Handles Genesis block creation."""
    # Convert data dictionary to ordered JSON string for consistent hashing
    data_str = json.dumps(data, sort_keys=True)
    
    # Get last block
    last_block = db.query(BlockchainBlock).order_by(BlockchainBlock.block_index.desc()).first()
    
    if last_block is None:
        # Create Genesis block
        genesis_index = 0
        genesis_timestamp = datetime.utcnow()
        genesis_action = "GENESIS"
        genesis_data = json.dumps({"message": "CrimeNet Genesis Block"}, sort_keys=True)
        genesis_prev_hash = "0" * 64
        genesis_hash = calculate_block_hash(
            genesis_index, genesis_timestamp, genesis_action, genesis_data, genesis_prev_hash
        )
        
        last_block = BlockchainBlock(
            block_index=genesis_index,
            timestamp=genesis_timestamp,
            action=genesis_action,
            data=genesis_data,
            previous_hash=genesis_prev_hash,
            hash=genesis_hash
        )
        db.add(last_block)
        db.commit()
        db.refresh(last_block)
        
    # Create the new block
    new_index = last_block.block_index + 1
    new_timestamp = datetime.utcnow()
    new_prev_hash = last_block.hash
    new_hash = calculate_block_hash(
        new_index, new_timestamp, action, data_str, new_prev_hash
    )
    
    new_block = BlockchainBlock(
        block_index=new_index,
        timestamp=new_timestamp,
        action=action,
        data=data_str,
        previous_hash=new_prev_hash,
        hash=new_hash
    )
    
    db.add(new_block)
    db.commit()
    db.refresh(new_block)
    return new_block

def verify_ledger_integrity(db: Session) -> dict:
    """Cryptographically validates the entire blockchain stored in the database."""
    blocks = db.query(BlockchainBlock).order_by(BlockchainBlock.block_index.asc()).all()
    
    if not blocks:
        return {"status": "valid", "message": "Blockchain is empty.", "verified_blocks": 0}
        
    # Verify first block (Genesis)
    genesis = blocks[0]
    calculated_gen_hash = calculate_block_hash(
        genesis.block_index, genesis.timestamp, genesis.action, genesis.data, genesis.previous_hash
    )
    if genesis.hash != calculated_gen_hash:
        return {
            "status": "tampered", 
            "message": f"Genesis block hash is invalid. Recalculated: {calculated_gen_hash}",
            "block_index": 0
        }
        
    for i in range(1, len(blocks)):
        prev_block = blocks[i - 1]
        current_block = blocks[i]
        
        # Verify previous hash linkage
        if current_block.previous_hash != prev_block.hash:
            return {
                "status": "tampered",
                "message": f"Hash linkage broken at block index {current_block.block_index}. Expected: {prev_block.hash}, Found: {current_block.previous_hash}",
                "block_index": current_block.block_index
            }
            
        # Verify current hash calculation
        calculated_hash = calculate_block_hash(
            current_block.block_index, current_block.timestamp, current_block.action, current_block.data, current_block.previous_hash
        )
        if current_block.hash != calculated_hash:
            return {
                "status": "tampered",
                "message": f"Block hash is invalid at block index {current_block.block_index}. Recalculated: {calculated_hash}",
                "block_index": current_block.block_index
            }
            
    return {
        "status": "valid",
        "message": f"Blockchain integrity verified successfully. Ledger is secure and untampered.",
        "verified_blocks": len(blocks)
    }
