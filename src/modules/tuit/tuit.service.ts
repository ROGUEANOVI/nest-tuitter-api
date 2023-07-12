import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateTuitDto,
  UpdateTuitDto,
  ResponseTuitDto,
  PaginationQueryDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tuit } from './entities/tuit.entity';

@Injectable()
export class TuitService {
  constructor(
    @InjectRepository(Tuit)
    private tuitRepository: Repository<Tuit>,
  ) {}

  async getAllTuits({
    limit,
    offset,
  }: PaginationQueryDto): Promise<ResponseTuitDto> {
    const tuits = await this.tuitRepository.find({
      relations: ['user'],
      take: limit,
      skip: offset,
    });

    const response = new ResponseTuitDto();
    response.isSuccessful = true;
    response.message = 'Successful query';
    response.data = tuits;

    return response;
  }

  async getTuitById(id: number): Promise<ResponseTuitDto> {
    const tuitFound = await this.tuitRepository.findOne({ where: { id } });

    if (!tuitFound) {
      throw new HttpException('Tuit not found', HttpStatus.NOT_FOUND);
    }

    const response = new ResponseTuitDto();
    response.isSuccessful = true;
    response.message = 'Successful query';
    response.data = tuitFound;

    return response;
  }

  async createTuit({ user, content }: CreateTuitDto): Promise<ResponseTuitDto> {
    const createdTuit = this.tuitRepository.create({ user, content });
    const savedTuit = await this.tuitRepository.save(createdTuit);
    if (!savedTuit) {
      throw new HttpException(
        'An error occurred while creating the tuit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const response = new ResponseTuitDto();
    response.isSuccessful = true;
    response.message = 'successful created tuit';
    response.data = savedTuit;

    return response;
  }

  async updateTuit(id: number, tuit: UpdateTuitDto): Promise<ResponseTuitDto> {
    const tuitFound = await this.tuitRepository.findOne({ where: { id } });

    if (!tuitFound) {
      throw new HttpException('Tuit not found', HttpStatus.NOT_FOUND);
    }

    const updatedTuit = await this.tuitRepository.update({ id }, tuit);
    if (!updatedTuit.affected) {
      throw new HttpException(
        'An error occurred while updating the tuit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const response = new ResponseTuitDto();
    response.isSuccessful = true;
    response.message = 'successfully updated tuit';
    response.data = null;

    return response;
  }

  async deleteTuit(id: number): Promise<ResponseTuitDto> {
    const tuitFound = await this.tuitRepository.findOne({ where: { id } });

    if (!tuitFound) {
      throw new HttpException('Tuit not found', HttpStatus.NOT_FOUND);
    }

    const deletedTuit = await this.tuitRepository.delete({ id });
    if (!deletedTuit.affected) {
      throw new HttpException(
        'An error occurred while removing the tuit',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const response = new ResponseTuitDto();
    response.isSuccessful = true;
    response.message = 'successfully deleted tuit';
    response.data = null;

    return response;
  }
}
